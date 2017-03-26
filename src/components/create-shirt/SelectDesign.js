import React from 'react'
import {toggleDesignModel, updateOrder} from '../../action'
import Modal from '../Modal'
import {connect} from 'react-redux'
import {values} from 'lodash'
import {Card} from 'react-mdl'
import css from './create-shirt.css'
import uuid from 'uuid/v4'

@connect(state => ({
  order: state.ui.createOrder.order
}), dispatch => ({
  updateOrder (order) {
    dispatch(updateOrder(order))
  }
}))
class DesignCard extends React.Component {
  handleDesignSelect = e => {
    this.props.updateOrder({
      designs: {
        ...this.props.order.designs,
        [uuid()]: {
          designId: this.props.design.id,
          height: 100,
          width:100,
          x: 200,
          y: 200
        }
      }
    })
    this.props.onSelect && this.props.onSelect(e)
  }

  render () {
    return <Card onClick={this.handleDesignSelect}
      shadow={0}
      className={css.designcard}
      style={{background: `url(${this.props.design.imgUrl}) center / cover`}} />
  }
}

@connect(state => ({
  open: state.ui.createOrder.isDesignModelOpen,
  tags: state.entities.tags,
  designs: state.entities.designs
}), dispatch => ({
  toggleDesignModel () {
    dispatch(toggleDesignModel)
  }
}))
export default class SelectDesign extends React.Component {
  handleToggleDesignModel = e => {
    e.preventDefault()
    this.props.toggleDesignModel()
  }

  render () {
    const tags = values(this.props.tags)
    const designs = values(this.props.designs.byIds)
    return <Modal onCloseModal={this.handleToggleDesignModel} open={this.props.open}>
      <div className={css.flexlist}>
      </div>
      {designs.map(design => <DesignCard onSelect={this.handleToggleDesignModel} design={design} />)}
    </Modal>
  }
}
