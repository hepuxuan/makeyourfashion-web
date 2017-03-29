import React from 'react';
import { Layer, Image, Stage, Rect, Group } from 'react-konva';
import { connect } from 'react-redux';
import { Button } from 'react-mdl';
import { keys } from 'lodash';
import { updateOrder, fetchDesigns } from '../../action';
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  RECT_WIDTH,
  RECT_HEIGHT,
} from './consts';

const { func, shape, array, string } = React.PropTypes;

@connect(state => ({
  designs: state.entities.designs,
  order: state.ui.createOrder.order,
}), dispatch => ({
  fetchDesigns() {
    dispatch(fetchDesigns());
  },
  updateOrder(order) {
    dispatch(updateOrder(order));
  },
}))
class Design extends React.Component {
  static propTypes = {
    fetchDesigns: func.isRequired,
    order: shape({
      designs: array
    }).isRequired,
    designUuid: string.isRequired,
    designs: array.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      image: null,
    };
  }

  componentDidMount() {
    this.props.fetchDesigns();
    const designId = this.props.order.designs[this.props.designUuid].designId;
    const design = this.props.designs.byIds[designId];
    if (design) {
      const image = new window.Image()
      image.src = design.imgUrl
      image.onload = () => {
        this.setState({
          image: image,
        })
      }
    }

    if (this.props.editible) {
      this.rect.show();
    }

    if (!this.props.editible) {
      this.rect.hide();
    }
  }

  componentWillReceiveProps(nextProps) {
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

  handleDragEnd = () => {
    const { height, width } = this.props.order.designs[this.props.designUuid];
    this.props.updateOrder({
      designs: {
        ...this.props.order.designs,
        [this.props.designUuid]: {
          ...this.props.order.designs[this.props.designUuid],
          x: this.group.attrs.x,
          y: this.group.attrs.y,
        },
      },
    });
  }

  render() {
    const {x, y, height, width} = this.props.order.designs[this.props.designUuid]
    return <Group
      ref={(g) => { this.group = g; }}
      x={x} y={y}
      width={width} height={height}
      draggable={this.props.editible}
      onDragStart={this.handleDragStart}
      onDragEnd={this.handleDragEnd}>
      <Rect ref={(r) => { this.rect = r; }}
        stroke='white' width={width} height={height} dash={[10, 5]}
      />
      <Image
        width={width} height={height}
        image={this.state.image} />
    </Group>
  }
}

const EDIT_MODE = 'edit'
const VIEW_MODE = 'view'

@connect(state => ({
  order: state.ui.createOrder.order,
  products: state.entities.products
}))
export default class CreateShirtCanvas extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      image: null,
      mode: EDIT_MODE
    }
  }

  componentDidMount () {
    const product = this.props.products[this.props.order.productId]
    if (product) {
      const image = new window.Image()
      image.src = product.imgUrl
      image.onload = () => {
        this.setState({
          image: image
        })
      }
    }
  }

  componentWillReceiveProps (nextProps) {
    const currentProduct = this.props.products[this.props.order.productId] || {}
    const newProduct = nextProps.products[nextProps.order.productId] || {}
    if (currentProduct.id !== newProduct.id) {
      const image = new window.Image()
      image.src = newProduct.imgUrl
      image.onload = () => {
        this.setState({
          image: image
        })
      }
    }
  }

  handlLayerChange = () => {
    this.refs.layer.draw();
  }

  handleEditClick = (e) => {
    e.preventDefault();
    this.setState({
      mode: EDIT_MODE,
    });

    this.rect.show();
    this.refs.layer.draw();
  }

  handleViewClick = (e) => {
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
            <Rect ref={(r) => { this.rect = r; }} x={CANVAS_WIDTH/2 - RECT_WIDTH/2} y={100 * (CANVAS_HEIGHT / 500)} stroke='white' width={RECT_WIDTH} height={CANVAS_HEIGHT/3 * 2} />
            { keys(this.props.order.designs).map(k => <Design key={k}
                editible={this.state.mode === EDIT_MODE}
                bundary={{ x: (CANVAS_WIDTH / 2) - (RECT_WIDTH / 2), y: 100, width: RECT_WIDTH, height: RECT_HEIGHT }}
                onChangeLayer={this.handlLayerChange} designUuid={k} />) }
          </Layer>
        </Stage>
      </div>
    )
  }
}
