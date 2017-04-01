// @flow
import React from 'react';
import { Image, Rect, Group } from 'react-konva';
import { connect } from 'react-redux';
import { updateOrder, fetchDesigns } from '../../action';
import {
  toCanvasPx,
  fromCanvasPx,
  toCanvasHeight,
  toCanvasWidth,
  fromCanvasHeight,
  fromCanvasWidth,
} from './util';

type KonvaType = {
  show: () => void,
  hide: () => void,
  setX: () => void,
  setY: () => void,
  setWidth: () => void,
  setHeight: () => void,
  attrs: {
    x: number,
    y: number,
    height: number,
    width: number,
  },
}

class Design extends React.Component {
  constructor(props: {}) {
    super(props);
    this.state = {
      image: null,
    };
  }

  state: {
    image: Image,
  }

  componentDidMount() {
    this.props.fetchDesigns();
    const designId = this.props.order.designs[this.props.designUuid].designId;
    const design = this.props.designs.byIds[designId];
    if (design) {
      const image = new window.Image();
      image.src = design.imgUrl;
      image.onload = () => {
        this.setState({
          image,
        });
      };
    }

    if (this.props.editible) {
      this.topleft.show();
      this.topright.show();
      this.bottomleft.show();
      this.bottomright.show();
      this.rect.show();
    }

    if (!this.props.editible) {
      this.topleft.hide();
      this.topright.hide();
      this.bottomleft.hide();
      this.bottomright.hide();
      this.rect.hide();
    }
  }

  componentWillReceiveProps(nextProps: any) {
    const nextDesignId = nextProps.order.designs[nextProps.designUuid].designId;
    const design = nextProps.designs.byIds[nextDesignId];
    if (design) {
      const image = new window.Image();
      image.src = design.imgUrl;
      image.onload = () => {
        this.setState({
          image,
        });
      };
    }

    if (nextProps.editible) {
      this.rect.show();
      this.topleft.show();
      this.topright.show();
      this.bottomleft.show();
      this.bottomright.show();
      this.props.onChangeLayer();
    }

    if (!nextProps.editible) {
      this.rect.hide();
      this.topleft.hide();
      this.topright.hide();
      this.bottomleft.hide();
      this.bottomright.hide();
      this.props.onChangeLayer();
    }
  }

  rect: KonvaType

  topleft: KonvaType

  topright: KonvaType

  bottomleft: KonvaType

  bottomright: KonvaType

  image: KonvaType

  group: KonvaType

  props: {
    updateOrder: ({designs: any}) => void,
    onChangeLayer: () => void,
    fetchDesigns: () => void,
    editible: boolean,
    order: {
      designs: {}
    },
    designUuid: string,
    designs: {
      byIds: {}
    }
  }

  handleDragEnd = () => {
    const { x, y } = fromCanvasPx(this.group.attrs.x, this.group.attrs.y);
    this.props.updateOrder({
      designs: {
        ...this.props.order.designs,
        [this.props.designUuid]: {
          ...this.props.order.designs[this.props.designUuid],
          x,
          y,
        },
      },
    });
  }

  handleDragGroup = () => {
    this.topleft.setX(this.group.attrs.x - 10);
    this.topleft.setY(this.group.attrs.y - 10);
    this.reRenderRect();
  }

  reRenderRect = () => {
    this.topleft.setX(this.group.attrs.x - 10);
    this.topleft.setY(this.group.attrs.y - 10);
    this.bottomleft.setX(this.group.attrs.x - 10);
    this.bottomleft.setY(this.group.attrs.y + this.group.attrs.height);
    this.topright.setX(this.group.attrs.x + this.group.attrs.width);
    this.topright.setY(this.group.attrs.y - 10);
    this.bottomright.setX(this.group.attrs.x + this.group.attrs.width);
    this.bottomright.setY(this.group.attrs.y + this.group.attrs.height);
  }

  reRenderGroup = (x: number, y: number, width: number, height: number) => {
    this.group.setX(x);
    this.group.setY(y);
    this.group.setWidth(width);
    this.group.setHeight(height);
    this.rect.setWidth(width);
    this.rect.setHeight(height);
    this.image.setWidth(width);
    this.image.setHeight(height);
    this.reRenderRect();
  }

  handleResizeEnd = () => {
    const { x, y } = fromCanvasPx(this.group.attrs.x, this.group.attrs.y);
    const width = fromCanvasWidth(this.group.attrs.width);
    const height = fromCanvasHeight(this.group.attrs.height);
    this.props.updateOrder({
      designs: {
        ...this.props.order.designs,
        [this.props.designUuid]: {
          ...this.props.order.designs[this.props.designUuid],
          x,
          y,
          width,
          height,
        },
      },
    });
  }

  handleDragTopleft = () => {
    const groupx = this.topleft.attrs.x + 10;
    const groupy = this.topleft.attrs.y + 10;
    const width = (this.group.attrs.x - groupx) + this.group.attrs.width;
    const height = (this.group.attrs.y - groupy) + this.group.attrs.height;
    this.reRenderGroup(groupx, groupy, width, height);
  }

  handleDragBottomleft = () => {
    const groupx = this.bottomleft.attrs.x + 10;
    const width = (this.group.attrs.x - groupx) + this.group.attrs.width;
    const height = this.bottomleft.attrs.y - this.group.attrs.y - 10;
    this.reRenderGroup(groupx, this.group.attrs.y, width, height);
  }

  handleDragTopRight = () => {
    const groupy = this.topright.attrs.y + 10;
    const width = this.topright.attrs.x - this.group.attrs.x - 10;
    const height = (this.group.attrs.y - this.topright.attrs.y - 10) + this.group.attrs.height;
    this.reRenderGroup(this.group.attrs.x, groupy, width, height);
  }

  handleDragBottomRight = () => {
    const width = this.bottomright.attrs.x - this.group.attrs.x;
    const height = this.bottomright.attrs.y - this.group.attrs.y;
    this.reRenderGroup(this.group.attrs.x, this.group.attrs.y, width, height);
  }

  render() {
    const { x, y, width, height } = this.props.order.designs[this.props.designUuid];
    const canvasXY = toCanvasPx(x, y);
    const adjWidth = toCanvasWidth(width);
    const adjHeight = toCanvasHeight(height);
    return (
      <Group>
        <Rect
          draggable={this.props.editible}
          onDragMove={this.handleDragTopleft}
          onDragEnd={this.handleResizeEnd}
          ref={(r) => { this.topleft = r; }}
          stroke="white" x={canvasXY.x - 10} y={canvasXY.y - 10} width={10} height={10}
        />
        <Rect
          draggable={this.props.editible}
          onDragMove={this.handleDragBottomleft}
          onDragEnd={this.handleResizeEnd}
          ref={(r) => { this.bottomleft = r; }}
          stroke="white" x={canvasXY.x - 10} y={canvasXY.y + adjHeight} width={10} height={10}
        />
        <Rect
          draggable={this.props.editible}
          onDragMove={this.handleDragTopRight}
          onDragEnd={this.handleResizeEnd}
          ref={(r) => { this.topright = r; }}
          stroke="white" x={canvasXY.x + adjWidth} y={canvasXY.y - 10} width={10} height={10}
        />
        <Rect
          draggable={this.props.editible}
          onDragMove={this.handleDragBottomRight}
          onDragEnd={this.handleResizeEnd}
          ref={(r) => { this.bottomright = r; }}
          stroke="white" x={canvasXY.x + adjWidth} y={canvasXY.y + adjHeight} width={10} height={10}
        />
        <Group
          ref={(g) => { this.group = g; }}
          x={canvasXY.x} y={canvasXY.y}
          width={adjWidth} height={adjHeight}
          draggable={this.props.editible}
          onDragMove={this.handleDragGroup}
          onDragEnd={this.handleDragEnd}
        >
          <Rect
            ref={(r) => { this.rect = r; }}
            stroke="white" width={adjWidth} height={adjHeight} dash={[10, 5]}
          />
          <Image
            ref={(r) => { this.image = r; }}
            width={adjWidth} height={adjHeight}
            image={this.state.image}
          />
        </Group>
      </Group>
    );
  }
}

export default connect(state => ({
  designs: state.entities.designs,
  order: state.ui.createOrder.order,
}), dispatch => ({
  fetchDesigns() {
    dispatch(fetchDesigns());
  },
  updateOrder(order) {
    dispatch(updateOrder(order));
  },
}))(Design);
