// @flow
import React from 'react';
import { Image, Rect, Group, Circle } from 'react-konva';
import { connect } from 'react-redux';
import { omit } from 'lodash';
import { updateOrder, fetchDesigns } from '../../action';
import {
  toCanvasPx,
  fromCanvasPx,
  toCanvasHeight,
  toCanvasWidth,
  fromCanvasHeight,
  fromCanvasWidth,
} from './util';
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  RECT_WIDTH,
  RECT_HEIGHT,
} from './consts';

const ZOOM_BTN_SIZE = 5;
const MIN_DESIGN_SIZE = 10;

function getDragBound(pos: Pos, minx: number, miny: number, maxx: number, maxy: number) {
  let x;
  let y;

  if (pos.x < minx) {
    x = minx;
  } else if (pos.x > maxx) {
    x = maxx;
  } else {
    x = pos.x;
  }

  if (pos.y < miny) {
    y = miny;
  } else if (pos.y > maxy) {
    y = maxy;
  } else {
    y = pos.y;
  }

  return {
    x,
    y,
  };
}

class Design extends React.Component {
  state = {
    image: null,
    removeImg: null,
  };

  componentDidMount() {
    this.props.fetchDesigns();
    const designId = this.props.order.designs[this.props.designUuid].designId;
    const design = this.props.designs.byIds[designId];
    const removeImg = new window.Image();
    removeImg.src = '/makeyourfashion-web/docs/delete.svg';
    // removeImg.src = '/docs/delete.svg'; // uncomment locally
    removeImg.onload = () => {
      this.setState({
        removeImg,
      });
    };
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
      this.removeBtn.show();
    }

    if (!this.props.editible) {
      this.topleft.hide();
      this.topright.hide();
      this.bottomleft.hide();
      this.bottomright.hide();
      this.rect.hide();
      this.removeBtn.hide();
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
      this.removeBtn.show();
      this.props.onChangeLayer();
    }

    if (!nextProps.editible) {
      this.rect.hide();
      this.topleft.hide();
      this.topright.hide();
      this.bottomleft.hide();
      this.bottomright.hide();
      this.removeBtn.hide();
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

  removeBtn: KonvaType

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

  handleDragBound = (pos: Pos) => {
    const minx = (CANVAS_WIDTH - RECT_WIDTH) / 2;
    const miny = (CANVAS_HEIGHT - RECT_HEIGHT) / 2;
    const maxx = (minx + RECT_WIDTH) - this.group.attrs.width;
    const maxy = (miny + RECT_HEIGHT) - this.group.attrs.height;
    return getDragBound(pos, minx, miny, maxx, maxy);
  }

  handleDragTopLeftBound = (pos: Pos) => {
    const minx = ((CANVAS_WIDTH - RECT_WIDTH) / 2) - ZOOM_BTN_SIZE;
    const miny = ((CANVAS_HEIGHT - RECT_HEIGHT) / 2) - ZOOM_BTN_SIZE;
    const maxx = (this.group.attrs.x + this.group.attrs.width) - ZOOM_BTN_SIZE - MIN_DESIGN_SIZE;
    const maxy = (this.group.attrs.y + this.group.attrs.height) - ZOOM_BTN_SIZE - MIN_DESIGN_SIZE;
    return getDragBound(pos, minx, miny, maxx, maxy);
  }

  handleDragBottomLeftBound = (pos: Pos) => {
    const minx = ((CANVAS_WIDTH - RECT_WIDTH) / 2) - ZOOM_BTN_SIZE;
    const miny = this.group.attrs.y + ZOOM_BTN_SIZE + MIN_DESIGN_SIZE;
    const maxx = (this.group.attrs.x + this.group.attrs.width) - ZOOM_BTN_SIZE - MIN_DESIGN_SIZE;
    const maxy = ((CANVAS_HEIGHT - RECT_HEIGHT) / 2) + RECT_HEIGHT + ZOOM_BTN_SIZE;
    return getDragBound(pos, minx, miny, maxx, maxy);
  }

  handleDragTopRightBound = (pos: Pos) => {
    const minx = this.group.attrs.x + ZOOM_BTN_SIZE + MIN_DESIGN_SIZE;
    const miny = ((CANVAS_HEIGHT - RECT_HEIGHT) / 2) - ZOOM_BTN_SIZE;
    const maxx = ((CANVAS_WIDTH - RECT_WIDTH) / 2) + RECT_WIDTH + ZOOM_BTN_SIZE;
    const maxy = (this.group.attrs.y + this.group.attrs.height) - ZOOM_BTN_SIZE - MIN_DESIGN_SIZE;
    return getDragBound(pos, minx, miny, maxx, maxy);
  }

  handleDragBottomRightBound = (pos: Pos) => {
    const minx = this.group.attrs.x + ZOOM_BTN_SIZE + MIN_DESIGN_SIZE;
    const miny = this.group.attrs.y + ZOOM_BTN_SIZE + MIN_DESIGN_SIZE;
    const maxx = ((CANVAS_WIDTH - RECT_WIDTH) / 2) + RECT_WIDTH;
    const maxy = ((CANVAS_HEIGHT - RECT_HEIGHT) / 2) + RECT_HEIGHT;
    return getDragBound(pos, minx, miny, maxx, maxy);
  }


  handleDragGroup = () => {
    this.topleft.setX(this.group.attrs.x - ZOOM_BTN_SIZE);
    this.topleft.setY(this.group.attrs.y - ZOOM_BTN_SIZE);
    this.reRenderRect();
  }

  reRenderRect = () => {
    this.topleft.setX(this.group.attrs.x - ZOOM_BTN_SIZE);
    this.topleft.setY(this.group.attrs.y - ZOOM_BTN_SIZE);
    this.bottomleft.setX(this.group.attrs.x - ZOOM_BTN_SIZE);
    this.bottomleft.setY(this.group.attrs.y + this.group.attrs.height + ZOOM_BTN_SIZE);
    this.topright.setX(this.group.attrs.x + this.group.attrs.width + ZOOM_BTN_SIZE);
    this.topright.setY(this.group.attrs.y - ZOOM_BTN_SIZE);
    this.bottomright.setX(this.group.attrs.x + this.group.attrs.width + ZOOM_BTN_SIZE);
    this.bottomright.setY(this.group.attrs.y + this.group.attrs.height + ZOOM_BTN_SIZE);
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
    const groupx = this.topleft.attrs.x + ZOOM_BTN_SIZE;
    const groupy = this.topleft.attrs.y + ZOOM_BTN_SIZE;
    const width = (this.group.attrs.x - groupx) + this.group.attrs.width;
    const height = (this.group.attrs.y - groupy) + this.group.attrs.height;
    this.reRenderGroup(groupx, groupy, width, height);
  }

  handleDragBottomleft = () => {
    const groupx = this.bottomleft.attrs.x + ZOOM_BTN_SIZE;
    const width = (this.group.attrs.x - groupx) + this.group.attrs.width;
    const height = this.bottomleft.attrs.y - this.group.attrs.y - ZOOM_BTN_SIZE;
    this.reRenderGroup(groupx, this.group.attrs.y, width, height);
  }

  handleDragTopRight = () => {
    const groupy = this.topright.attrs.y + ZOOM_BTN_SIZE;
    const width = this.topright.attrs.x - this.group.attrs.x - ZOOM_BTN_SIZE;
    const height = (this.group.attrs.y - this.topright.attrs.y - ZOOM_BTN_SIZE)
      + this.group.attrs.height;
    this.reRenderGroup(this.group.attrs.x, groupy, width, height);
  }

  handleDragBottomRight = () => {
    const width = this.bottomright.attrs.x - this.group.attrs.x;
    const height = this.bottomright.attrs.y - this.group.attrs.y;
    this.reRenderGroup(this.group.attrs.x, this.group.attrs.y, width, height);
  }

  handleRemoveDesign = () => {
    const designs = omit(this.props.order.designs, this.props.designUuid);
    this.props.updateOrder({
      designs,
    });
  }

  handleMouseOver = (e: Event) => {
    document.body.style.cursor = 'pointer';
    e.target.setStrokeWidth(2);
    this.props.onChangeLayer();
  }

  handleMouseOut = (e: Event) => {
    document.body.style.cursor = 'default';
    e.target.setStrokeWidth(1);
    this.props.onChangeLayer();
  }

  render() {
    const { x, y, width, height } = this.props.order.designs[this.props.designUuid];
    const canvasXY = toCanvasPx(x, y);
    const adjWidth = toCanvasWidth(width);
    const adjHeight = toCanvasHeight(height);
    return (
      <Group>
        <Circle
          strokeWidth={1}
          draggable={this.props.editible}
          onDragMove={this.handleDragTopleft}
          onDragEnd={this.handleResizeEnd}
          onMouseOver={this.handleMouseOver}
          onMouseOut={this.handleMouseOut}
          dragBoundFunc={this.handleDragTopLeftBound}
          ref={(r) => { this.topleft = r; }}
          fill="grey"
          stroke="white"
          x={canvasXY.x - ZOOM_BTN_SIZE}
          y={canvasXY.y - ZOOM_BTN_SIZE} radius={Math.sqrt(2) * ZOOM_BTN_SIZE}
        />
        <Circle
          strokeWidth={1}
          draggable={this.props.editible}
          onDragMove={this.handleDragBottomleft}
          onDragEnd={this.handleResizeEnd}
          onMouseOver={this.handleMouseOver}
          onMouseOut={this.handleMouseOut}
          dragBoundFunc={this.handleDragBottomLeftBound}
          ref={(r) => { this.bottomleft = r; }}
          fill="grey"
          stroke="white"
          x={canvasXY.x - ZOOM_BTN_SIZE}
          y={canvasXY.y + adjHeight + ZOOM_BTN_SIZE} radius={Math.sqrt(2) * ZOOM_BTN_SIZE}
        />
        <Circle
          strokeWidth={1}
          draggable={this.props.editible}
          onDragMove={this.handleDragTopRight}
          onDragEnd={this.handleResizeEnd}
          onMouseOver={this.handleMouseOver}
          onMouseOut={this.handleMouseOut}
          dragBoundFunc={this.handleDragTopRightBound}
          ref={(r) => { this.topright = r; }}
          fill="grey"
          stroke="white"
          x={canvasXY.x + adjWidth + ZOOM_BTN_SIZE}
          y={canvasXY.y - ZOOM_BTN_SIZE} radius={Math.sqrt(2) * ZOOM_BTN_SIZE}
        />
        <Circle
          strokeWidth={1}
          draggable={this.props.editible}
          onDragMove={this.handleDragBottomRight}
          onDragEnd={this.handleResizeEnd}
          onMouseOver={this.handleMouseOver}
          onMouseOut={this.handleMouseOut}
          dragBoundFunc={this.handleDragBottomRightBound}
          ref={(r) => { this.bottomright = r; }}
          fill="grey"
          stroke="white"
          x={canvasXY.x + adjWidth + ZOOM_BTN_SIZE}
          y={canvasXY.y + adjHeight + ZOOM_BTN_SIZE} radius={Math.sqrt(2) * ZOOM_BTN_SIZE}
        />
        <Group
          ref={(g) => { this.group = g; }}
          x={canvasXY.x} y={canvasXY.y}
          width={adjWidth} height={adjHeight}
          draggable={this.props.editible}
          onDragMove={this.handleDragGroup}
          onDragEnd={this.handleDragEnd}
          dragBoundFunc={this.handleDragBound}
        >
          <Group
            x={-27.5}
            y={(adjHeight - 30) / 2}
            ref={(g) => { this.removeBtn = g; }}
            onClick={this.handleRemoveDesign}
            onTouchStart={this.handleRemoveDesign}
          >
            <Rect
              fill="white"
              x={2.5}
              height={20}
              width={15}
            />
            <Image
              height={20}
              width={20}
              image={this.state.removeImg}
              onMouseOver={this.handleMouseOver}
              onMouseOut={this.handleMouseOut}
            />
          </Group>
          <Rect
            strokeWidth={1}
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
