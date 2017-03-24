import React from 'react'
import {FABButton, Icon, List, ListItem, Grid, Cell, Textfield} from 'react-mdl'
import {connect} from 'react-redux'
import { toggleProductModel, toggleDesignModel } from '../../action'
import css from './create-shirt.css'
import { fetchProducts } from '../../action'

@connect(state => ({
  products: state.entities.products,
  order: state.ui.createOrder.order
}), dispatch => ({
  toggleProductModel () {
    dispatch(toggleProductModel)
  },
  toggleDesignModel () {
    dispatch(toggleDesignModel)
  },
  fetchProducts () {
    dispatch(fetchProducts())
  }
}))
export default class LeftPanel extends React.Component {
  componentDidMount () {
    this.props.fetchProducts()
  }

  handleSelectProduct = e => {
    e.preventDefault()
    this.props.toggleProductModel()
  }

  handleSelectDesign = e => {
    e.preventDefault()
    this.props.toggleDesignModel()
  }

  handleAddText = e => {
    e.preventDefault()
    console.log('add text')
  }

  render () {
    const product = this.props.products[this.props.order.productId]
    return <div>
      <p className={css.productname}>{product.name}</p>
      <List>
        <ListItem>
          <label className={css.label}>
            <FABButton onClick={this.handleSelectProduct} mini name='select-product'>
              <Icon name="collections" />
            </FABButton>
            <label htmlFor='select-product'> 选择产品 </label>
          </label>
        </ListItem>
        <ListItem>
          <label className={css.label}>
            <FABButton onClick={this.handleSelectDesign} mini name='select-design'>
              <Icon name="insert_photo" />
            </FABButton>
            <label htmlFor='select-design'> 选择设计 </label>
          </label>
        </ListItem>
        <ListItem>
          <label className={css.label}>
            <FABButton onClick={this.handleAddText} mini name='add-text'>
              <Icon name="title" />
            </FABButton>
            <label htmlFor='add-text'> 添加文字 </label>
          </label>
        </ListItem>
      </List>
    </div>
  }
}
