import React from 'react'
import {Layer, Image, Stage, Rect} from 'react-konva'
import {connect} from 'react-redux'
import {updateOrder} from '../../action'
import {values, isEqual} from 'lodash'

@connect(state => ({
  order: state.ui.createOrder.order,
  designs: state.entities.designs
}), dispatch => ({
  updateOrder (order) {
    dispatch(updateOrder(order))
  }
}))
export default class CreateShirtCanvas extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      image: null,
      designImages: {}
    }
  }

  handleDragStart = e => {
    console.log(e)
  }

  handleDragEnd = e => {
    console.log(e)
  }

  componentDidMount () {
    if (this.props.image) {
      const image = new window.Image()
      image.src = this.props.image
      image.onload = () => {
        this.setState({
          image: image
        })
      }
    }

    values(this.props.order.designs).forEach(({designId}) => {
      const image = new window.Image()
      image.src = this.props.designs[designId].imgUrl
      image.onload = () => {
        this.setState({
          designImages: {
            ...this.state.designImages,
            [designId]: image
          }
        })
      }
    })
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.image !== this.props.image) {
      const image = new window.Image()
      image.src = nextProps.image
      image.onload = () => {
        this.setState({
          image: image
        })
      }
    }
    if (!isEqual(nextProps.order.designs, this.props.order.designs)) {
      values(nextProps.order.designs).forEach(({designId}) => {
        const image = new window.Image()
        image.src = nextProps.designs[designId].imgUrl
        image.onload = () => {
          this.setState({
            designImages: {
              ...this.state.designImages,
              [designId]: image
            }
          })
        }
      })
    }
  }

  render () {
    return (
      <Stage x={0} y={0} width={500} height={500}>
        <Layer>
          <Rect width={500} height={500} />
          <Image width={500} height={500} image={this.state.image} />
          {
            values(this.props.order.designs).map(({designId, x, y, height, width}) => {
              return <Image draggable x={x} y={y} width={width} height={height} image={this.state.designImages[designId]} />
            })
          }
        </Layer>
      </Stage>
    )
  }
}
