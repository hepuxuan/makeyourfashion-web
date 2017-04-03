import React from 'react'
import {Tabs, Tab, Card, CardTitle, CardActions} from 'react-mdl'
import css from './create-shirt.css'
import {connect} from 'react-redux'
import {values} from 'lodash'
import { toggleProductModel, updateOrder, fetchProducts } from '../../action'
import Modal from '../Modal'

@connect(null, dispatch => ({
  updateOrder (order) {
    dispatch(updateOrder(order))
  }
}))
class ProductCard extends React.Component {
  handleProductSelect = e => {
    this.props.updateOrder({
      productId: this.props.product.id,
    })
    this.props.onSelect && this.props.onSelect(e)
  }

  render () {
    const {product} = this.props
    return <Card onClick={this.handleProductSelect}
      shadow={0}
      className={css.productcard}
      style={{background: `url(${product.imgUrl}) center / cover`}}>
      <CardTitle expand />
      <CardActions className={css.cardacton}>
        <span>{product.name}</span>
      </CardActions>
    </Card>
  }
}

@connect(state => ({
  open: state.ui.createOrder.isProductModelOpen,
  categories: state.entities.categories,
  products: state.entities.products
}), dispatch => ({
  toggleProductModel () {
    dispatch(toggleProductModel)
  },
  fetchProducts () {
    dispatch(fetchProducts())
  }
}))
export default class SelectProduct extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      activeTab: 0
    }
  }

  componentDidMount() {
    this.props.fetchProducts()
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
    const products = values(this.props.products.byIds)
    let activeProducts
    if (this.state.activeTab === 0) {  // search for all products
      activeProducts = products
    } else {
      // TODO: better way to filter?
      activeProducts = products.filter(p => p.category === this.state.activeTab - 1)
    }

    return <Modal onCloseModal={this.handleToggleProductModel} open={this.props.open}>
      <Tabs activeTab={this.state.activeTab} onChange={this.handleTabChange} ripple>
        <Tab>全部</Tab>
        {categories.map((category, index) => <Tab key={index}>{category}</Tab>)}
      </Tabs>
      <div className={css.flexlist}>
        {
          activeProducts.map(product => <ProductCard onSelect={this.handleToggleProductModel} product={product} />)
        }
      </div>
    </Modal>
  }
}
