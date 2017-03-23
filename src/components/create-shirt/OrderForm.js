import React from 'react'
import Dropdown from '../Dropdown'
import {Textfield} from 'react-mdl'
import {connect} from 'react-redux'
import { updateOrder } from '../../action'
import {values, findKey} from 'lodash'
import css from './create-shirt.css'
import {SIZE_LOCALIZE_MAP} from '../../localize'
import {range} from 'lodash'

@connect(state => ({
  order: state.ui.createOrder.order,
  error: state.error.order
}), dispatch => ({
  updateOrder (order) {
    dispatch(updateOrder(order))
  }
}))
export default class OrderForm extends React.Component {
  handleSelectSize = text => {
    this.props.updateOrder({
      size: findKey(SIZE_LOCALIZE_MAP, (v) => v === text)
    })
  }

  handleSelectQty = text => {
    this.props.updateOrder({
      qty: +text
    })
  }

  render () {
    return <form className={css.orderform}>
      <div><label className={css.pricelabel}>{`¥ ${this.props.order.price.toFixed(2)}`}</label></div>
      <Dropdown label='数量' id='select-qty'
        value={this.props.order.qty}
        onSelect={this.handleSelectQty}
        items={range(1, 13)}
        error={this.props.error.qty} />
      <Dropdown label='尺码' id='select-size'
        value={SIZE_LOCALIZE_MAP[this.props.order.size]}
        onSelect={this.handleSelectSize}
        items={values(SIZE_LOCALIZE_MAP)}
        error={this.props.error.size} />
    </form>
  }
}
