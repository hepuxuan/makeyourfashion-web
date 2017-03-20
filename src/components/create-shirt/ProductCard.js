import React from 'react'
import {Card, CardTitle, CardActions} from 'react-mdl'
import css from './create-shirt.css'
import {connect} from 'react-redux'
import { updateOrder } from '../../action'

@connect(null, dispatch => ({
	updateOrder (order) {
		dispatch(updateOrder(order))
	}
}))
export default class ProductCard extends React.Component {
	handleProductSelect = e => {
		this.props.updateOrder({
			productId: this.props.product.id
		})
		this.props.onSelect && this.props.onSelect(e)
	}

	render () {
		const {product} = this.props
		return <Card onClick={this.handleProductSelect} shadow={0} className={css.productcard} style={{background: `url(${product.imgUrl}) center / cover`}}>
		  <CardTitle expand />
		  <CardActions className={css.cardacton}>
		    <span>{product.name}</span>
		  </CardActions>
		</Card>
	}
}
