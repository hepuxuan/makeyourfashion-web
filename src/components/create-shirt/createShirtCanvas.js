// @flow
/* eslint-disable react/no-string-refs */
import React from 'react';
import { Layer, Image, Stage, Rect } from 'react-konva';
import { connect } from 'react-redux';
import { Button } from 'react-mdl';
import { keys } from 'lodash';
import Design from './Design';
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  RECT_WIDTH,
  RECT_HEIGHT,
} from './consts';

const EDIT_MODE = 'edit';
const VIEW_MODE = 'view';

class CreateShirtCanvas extends React.Component {
  state = {
    image: null,
    mode: EDIT_MODE,
  }

  componentDidMount() {
    const product = this.props.products[this.props.order.productId];
    if (product) {
      const image = new window.Image();
      image.src = product.imgUrl;
      image.onload = () => {
        this.setState({
          image,
        });
      };
    }
  }

  componentWillReceiveProps(nextProps: any) {
    const currentProduct = this.props.products[this.props.order.productId] || {};
    const newProduct = nextProps.products[nextProps.order.productId] || {};
    if (currentProduct.id !== newProduct.id) {
      const image = new window.Image();
      image.src = newProduct.imgUrl;
      image.onload = () => {
        this.setState({
          image,
        });
      };
    }
  }

  props: {
    products: {},
    order: {
      productId: string,
      designs: Array<any>
    }
  }

  rect: {
    show: () => void,
    hide: () => void
  }

  handlLayerChange = () => {
    this.refs.layer.draw();
  }

  handleEditClick = (e: MouseEvent) => {
    e.preventDefault();
    this.setState({
      mode: EDIT_MODE,
    });

    this.rect.show();
    this.refs.layer.draw();
  }

  handleViewClick = (e: MouseEvent) => {
    e.preventDefault();
    this.setState({
      mode: VIEW_MODE,
    });
    this.rect.hide();
    this.refs.layer.draw();
  }

  render() {
    return (
      <div id="create-shirt-canvas">
        <Button onClick={this.handleEditClick} className={this.state.mode === EDIT_MODE ? 'activetab tab' : 'tab'} primary>编辑</Button>
        <Button onClick={this.handleViewClick} className={this.state.mode === VIEW_MODE ? 'activetab tab' : 'tab'} primary>预览</Button>
        <Stage x={0} y={0} width={CANVAS_WIDTH} height={CANVAS_WIDTH}>
          <Layer ref="layer">
            <Image width={CANVAS_WIDTH} height={CANVAS_HEIGHT} image={this.state.image} />
            <Rect
              ref={(r) => { this.rect = r; }}
              x={(CANVAS_WIDTH - RECT_WIDTH) / 2}
              y={(CANVAS_HEIGHT - RECT_HEIGHT) / 2}
              stroke="white"
              width={RECT_WIDTH}
              height={RECT_HEIGHT}
            />
            {
              keys(this.props.order.designs).map(k => <Design
                key={k}
                editible={this.state.mode === EDIT_MODE}
                onChangeLayer={this.handlLayerChange} designUuid={k}
              />)
            }
          </Layer>
        </Stage>
      </div>
    );
  }
}

export default connect(state => ({
  order: state.ui.createOrder.order,
  products: state.entities.products,
}))(CreateShirtCanvas);
/* eslint-enable react/no-string-refs */
