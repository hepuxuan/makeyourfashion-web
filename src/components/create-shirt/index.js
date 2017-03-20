import React from 'react'
import CreateShirtCanvas from './createShirtCanvas'
import css from './create-shirt.css'
import {Grid, Cell, Button} from 'react-mdl'
import LeftPanel from './LeftPanel'
import SelectProduct from './SelectProduct'
import {connect} from 'react-redux'
import OrderForm from './OrderForm'

@connect(state => ({
	products: state.entities.products,
	order: state.ui.createOrder.order
}))
export default class CreateShirt extends React.Component {
	render () {
		const product = this.props.products[this.props.order.productId]
		return <div>
			<Grid className={css.container}>
				<Cell col={3}>
					<LeftPanel />
				</Cell>
				<Cell col={6}>
					<CreateShirtCanvas 
						image={product.imgUrl}/>
				</Cell>
				<Cell col={3}>
					<OrderForm />
				</Cell>
			</Grid>
			<SelectProduct />
			<div className={css.actionarea}>
				<Button className={css.actionbutton} accent ripple raised>添加到购物车</Button>
			</div>
		</div>
	}
}
