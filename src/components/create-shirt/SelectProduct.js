import React from 'react'
import {Dialog, Tabs, Tab} from 'react-mdl'
import ProductCard from './ProductCard'
import css from './create-shirt.css'
import {connect} from 'react-redux'
import {values} from 'lodash'
import { toggleProductModel } from '../../action'

@connect(state => ({
	open: state.ui.createOrder.isProductModelOpen,
	categories: state.entities.categories,
	products: state.entities.products
}), dispatch => ({
	toggleProductModel () {
		dispatch(toggleProductModel)
	}
}))
export default class SelectProduct extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
			activeTab: 0
		}
	}

	handleTabChange = id => {
		if (id !== this.state.activeTab) {
			this.setState({
				activeTab: id
			})
		}
	}

	handleToggleProductModel = e => {
		e.preventDefault()
		this.props.toggleProductModel()
	}

	render () {
		const categories = values(this.props.categories)
		const products = values(this.props.products)
		let activeProducts
		if (this.state.activeTab === 0) {  // search for all products
			activeProducts = values(this.props.products)
		} else {
			// TODO: better way to filter?
			activeProducts = values(this.props.products).filter(p => p.category === this.state.activeTab - 1)
		}

		return <Dialog className={css.model} onCancel={this.handleToggleProductModel} open={this.props.open}>
		  <Tabs activeTab={this.state.activeTab} onChange={this.handleTabChange} ripple>
		  	<Tab>全部</Tab>
        {categories.map((category, index) => <Tab key={index}>{category}</Tab>)}
      </Tabs>
      <section className={css.productlist}>
      	{
      		activeProducts.map(product => <ProductCard onSelect={this.handleToggleProductModel} product={product} />)
      	}	
      </section>
		</Dialog>
	}
}
