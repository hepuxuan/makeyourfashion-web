import React from 'react'
import {Layer, Image, Stage, Rect} from 'react-konva'

export default class CreateShirtCanvas extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      image: null
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
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.image) {
      const image = new window.Image()
      image.src = nextProps.image
      image.onload = () => {
        this.setState({
          image: image
        })
      }
    }
  }

  render () {
    return (
      <Stage x={0} y={0} width={500} height={500}>
        <Layer>
          <Rect width={500} height={500} />
          <Image width={500} height={500} image={this.state.image}
            onDragEnd={this.handleDragStart}
            onDragStart={this.handleDragEnd}/>
        </Layer>
      </Stage>
    )
  }
}
