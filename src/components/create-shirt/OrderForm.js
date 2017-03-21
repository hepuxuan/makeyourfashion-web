import React from 'react'
import Dropdown from '../Dropdown'
import {Textfield} from 'react-mdl'
import {connect} from 'react-redux'
import { updateOrder } from '../../action'
import {values, findKey} from 'lodash'
import css from './create-shirt.css'

const SIZE_LOCALIZE_MAP = {
	small: '小号',
	medium: '中号',
	large: '大号'
}

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

	handleEnterQty = e => {
		if (e.target.value) {
			this.props.updateOrder({
				qty: +e.target.value
			})
		} else {
			this.props.updateOrder({
				qty: null
			})
		}
	}

	render () {
		return <form className={css.orderform}>
			<div><label className={css.pricelabel}>{`¥ ${this.props.order.price.toFixed(2)}`}</label></div>
			<Textfield
				error={this.props.error.qty}
		    onChange={this.handleEnterQty}
		    type='number'
		    value={this.props.order.qty}
		    label="数量"
		    floatingLabel
		    style={{width: '200px'}}
			/>
			<Dropdown label='尺码' id='select-size'
				value={SIZE_LOCALIZE_MAP[this.props.order.size]}
				onSelect={this.handleSelectSize}
				items={values(SIZE_LOCALIZE_MAP)}
				error={this.props.error.size} />
		</form>
	}
}
