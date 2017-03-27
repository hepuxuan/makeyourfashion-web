import React from 'react'
import {Layer, Image, Stage, Rect, Group} from 'react-konva'
import {connect} from 'react-redux'
import {updateOrder, fetchDesigns} from '../../action'
import {keys, isEqual} from 'lodash'
import {Button} from 'react-mdl'
import css from './create-shirt.css'

const CANVAS_HEIGHT = 500
const CANVAS_WIDTH = 500
const RECT_WIDTH = 180

@connect(state => ({
  designs: state.entities.designs,
  order: state.ui.createOrder.order
}), dispatch => ({
  fetchDesigns () {
    dispatch(fetchDesigns())
  },
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
    this.props.fetchDesigns()
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

    if (this.props.editible) {
      this.refs.rect.show()
    }

    if (!this.props.editible) {
      this.refs.rect.hide()
    }
  }

  componentWillReceiveProps (nextProps) {
    const nextDesignId = nextProps.order.designs[nextProps.designUuid].designId
    const design = nextProps.designs.byIds[nextDesignId]
    if (design) {
      const image = new window.Image()
      image.src = design.imgUrl
      image.onload = () => {
        this.setState({
          image: image
        })
      }
    }

    if (nextProps.editible && !this.props.editible) {
      this.refs.rect.show()
      this.props.onChangeLayer()
    }

    if (!nextProps.editible && this.props.editible) {
      this.refs.rect.hide()
      this.props.onChangeLayer()
    }
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
      draggable={this.props.editible}
      onDragStart={this.handleDragStart}
      onDragEnd={this.handleDragEnd}>
      <Rect ref='rect' stroke='white' width={width} height={height} dash={[10, 5]} />
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

  handlLayerChange = e => {
    this.refs.layer.draw()
  }

  handleEditClick = e => {
    e.preventDefault()
    this.setState({
      mode: EDIT_MODE
    })

    this.refs.rect.show()
    this.refs.layer.draw()
  }

  handleViewClick = e => {
    e.preventDefault()
    this.setState({
      mode: VIEW_MODE
    })
    this.refs.rect.hide()
    this.refs.layer.draw()
  }

  render () {
    return (
      <div id='create-shirt-canvas'>
        <Button onClick={this.handleEditClick} className={this.state.mode === EDIT_MODE ? css.activetab : null} primary>编辑</Button>
        <Button onClick={this.handleViewClick} className={this.state.mode === VIEW_MODE ? css.activetab : null} primary>预览</Button>
        <Stage x={0} y={0} width={CANVAS_WIDTH} height={CANVAS_WIDTH}>
          <Layer ref='layer'>
            <Image width={CANVAS_WIDTH} height={CANVAS_HEIGHT} image={this.state.image} />
            <Rect ref='rect' x={CANVAS_WIDTH/2 - RECT_WIDTH/2} y={100} stroke='white' width={RECT_WIDTH} height={CANVAS_HEIGHT/3 * 2} />
            { keys(this.props.order.designs).map(k => <Design key={k}
                editible={this.state.mode === EDIT_MODE}
                bundary={{x: CANVAS_WIDTH/2 - RECT_WIDTH/2, y: 100, width: RECT_WIDTH, height: CANVAS_HEIGHT/3 * 2}}
                onChangeLayer={this.handlLayerChange} designUuid={k} />) }
          </Layer>
        </Stage>
      </div>
    )
  }
}
