// @flow
import React from 'react';
import { Image, Rect, Group } from 'react-konva';
import { connect } from 'react-redux';
import { updateOrder, fetchDesigns } from '../../action';
import { toCanvasPx, fromCanvasPx, toCanvasHeight, toCanvasWidth } from './util';

class Design extends React.Component {
  constructor(props: {}) {
    super(props);
    this.state = {
      image: null,
    };
  }

  state: {
    image: Image
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
      this.rect.show();
    }

    if (!this.props.editible) {
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
      this.props.onChangeLayer();
    }

    if (!nextProps.editible) {
      this.rect.hide();
      this.props.onChangeLayer();
    }
  }

  rect: {
    show: () => void,
    hide: () => void
  }

  group: {
    attrs: {
      x: number,
      y: number
    }
  }

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

  render() {
    const { x, y, width, height } = this.props.order.designs[this.props.designUuid];
    const canvasXY = toCanvasPx(x, y);
    const adjWidth = toCanvasWidth(width);
    const adjHeight = toCanvasHeight(height);
    return (
      <Group
        ref={(g) => { this.group = g; }}
        x={canvasXY.x} y={canvasXY.y}
        width={adjWidth} height={adjHeight}
        draggable={this.props.editible}
        onDragEnd={this.handleDragEnd}
      >
        <Rect
          ref={(r) => { this.rect = r; }}
          stroke="white" width={adjWidth} height={adjHeight} dash={[10, 5]}
        />
        <Image
          width={adjWidth} height={adjHeight}
          image={this.state.image}
        />
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
