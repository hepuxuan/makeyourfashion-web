import React from 'react'
import {Layer, Image, Stage, Rect, Group} from 'react-konva'
import {connect} from 'react-redux'
import {updateOrder} from '../../action'
import {keys, isEqual} from 'lodash'

const CANVAS_HEIGHT = 500
const CANVAS_WIDTH = 500
const RECT_WIDTH = 180

@connect(state => ({
  designs: state.entities.designs,
  order: state.ui.createOrder.order
}), dispatch => ({
  updateOrder (order) {
    dispatch(updateOrder(order))
  }
}))
class Design extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      image: null
    }
  }

  componentDidMount () {
    document.addEventListener('click', this.handleClickDoc)
    const designId = this.props.order.designs[this.props.designUuid].designId
    const design = this.props.designs.byIds[designId]
    if (design) {
      const image = new window.Image()
      image.src = design.imgUrl
      image.onload = () => {
        this.setState({
          image: image
        })
      }
    }
  }

  handleClickDoc = e => {
    if (e.target !== document.querySelector('canvas')) {
      this.refs.rect.hide()
      this.props.onChangeLayer()
    }
  }

  componentWillUnmount () {
    document.removeEventListener(this.handleClickDoc)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.designUuid !== this.props.designUuid) {
      const nextDesignId = nextProps.designs[nextProps.designUuid]
      const design = nextProps.designs[nextDesignId]
      if (design) {
        const image = new window.Image()
        image.src = design.imgUrl
        image.onload = () => {
          this.setState({
            image: image
          })
        }
      }
    }
  }

  handleDragStart = e => {
    this.refs.rect.show()
    this.props.onChangeLayer()
  }

  handleClick = e => {
    this.refs.rect.show()
    this.props.onChangeLayer()
  }

  handleDragEnd = e => {
    const {height, width} = this.props.order.designs[this.props.designUuid]
    this.props.updateOrder({
      designs: {
        ...this.props.order.designs,
        [this.props.designUuid]: {
          ...this.props.order.designs[this.props.designUuid],
          x: e.evt.offsetX-width/2,
          y: e.evt.offsetY-height/2
        }
      }
    })
  }

  render () {
    const {x, y, height, width} = this.props.order.designs[this.props.designUuid]
    return <Group
      x={x} y={y}
      width={width} height={height}
      draggable
      onClick={this.handleClick}
      onDragStart={this.handleDragStart}
      onDragEnd={this.handleDragEnd}>
      <Rect ref='rect' stroke='white' width={width} height={height} dash={[10, 5]} />
      <Image
        width={width} height={height}
        image={this.state.image} />
    </Group>
  }
}

@connect(state => ({
  order: state.ui.createOrder.order,
  products: state.entities.products
}))
export default class CreateShirtCanvas extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      image: null,
      designImages: {}
    }
  }

  componentDidMount () {
    document.addEventListener('click', this.handleClickDoc)
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
    const newProduct = nextProps.products[nextProps.productId] || {}
    if (currentProduct.id !== currentProduct.id) {
      const image = new window.Image()
      image.src = newProduct.imgUrl
      image.onload = () => {
        this.setState({
          image: image
        })
      }
    }
  }

  componentWillUnmount () {
    document.removeEventListener(this.handleClickDoc)
  }

  handleClickDoc = e => {
    if (e.target !== document.querySelector('canvas')) {
      this.refs.rect.hide()
      this.handlLayerChange()
    }
  }

  handleClick = e => {
    this.refs.rect.show()
    this.handlLayerChange()
  }

  handlLayerChange = e => {
    this.refs.layer.draw()
  }

  render () {
    return (
      <Stage onClick={this.handleClick} x={0} y={0} width={CANVAS_WIDTH} height={CANVAS_WIDTH}>
        <Layer ref='layer'>
          <Image width={CANVAS_WIDTH} height={CANVAS_HEIGHT} image={this.state.image} />
          <Rect ref='rect' x={CANVAS_WIDTH/2 - RECT_WIDTH/2} y={100} stroke='white' width={RECT_WIDTH} height={CANVAS_HEIGHT/3 * 2} />
          { keys(this.props.order.designs).map(k => <Design key={k}
              bundary={{x: CANVAS_WIDTH/2 - RECT_WIDTH/2, y: 100, width: RECT_WIDTH, height: CANVAS_HEIGHT/3 * 2}}
              onChangeLayer={this.handlLayerChange} designUuid={k} />) }
        </Layer>
      </Stage>
    )
  }
}
