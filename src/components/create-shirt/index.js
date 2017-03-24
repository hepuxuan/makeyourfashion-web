import React from 'react'
import CreateShirtCanvas from './createShirtCanvas'
import css from './create-shirt.css'
import {Grid, Cell, Button, Spinner} from 'react-mdl'
import LeftPanel from './LeftPanel'
import SelectProduct from './SelectProduct'
import SelectDesign from './SelectDesign'
import {connect} from 'react-redux'
import OrderForm from './OrderForm'
import { fetchProducts, addToCart } from '../../action'

@connect(state => ({
  products: state.entities.products,
  order: state.ui.createOrder.order
}), dispatch => ({
  fetchProducts () {
    dispatch(fetchProducts())
  },
  addToCart (order) {
    dispatch(addToCart(order))
  }
}))
export default class CreateShirt extends React.Component {
  componentDidMount() {
    this.props.fetchProducts()
  }

  handleAddToCard = e => {
    e.preventDefault()
    this.props.addToCart({
      ...this.props.order,
      imgUrl: this.props.products[this.props.order.productId].imgUrl
    })
  }

  render () {
    const product = this.props.products[this.props.order.productId]
    return (() => {
      if (!product) {
        return <Spinner />
      } else {
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
          <SelectDesign />
          <div className={css.actionarea}>
            <Button onClick={this.handleAddToCard} className={css.actionbutton} accent ripple raised>添加到购物车</Button>
          </div>
        </div>
      }
    })()
  }
}
