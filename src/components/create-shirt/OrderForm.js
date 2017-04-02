import React from 'react';
import { connect } from 'react-redux';
import { values, findKey, range } from 'lodash';
import Dropdown from '../Dropdown';
import { updateOrder, fetchProducts } from '../../action';
import css from './create-shirt.css';
import { SIZE_LOCALIZE_MAP } from '../../localize';

@connect(state => ({
  order: state.ui.createOrder.order,
  products: state.entities.products,
  error: state.error.order,
}), dispatch => ({
  fetchProducts() {
    dispatch(fetchProducts());
  },
  updateOrder(order) {
    dispatch(updateOrder(order));
  },
}))
export default class OrderForm extends React.Component {
  componentDidMount() {
    this.props.fetchProducts();
  }

  handleSelectSize = (text) => {
    this.props.updateOrder({
      size: findKey(SIZE_LOCALIZE_MAP, v => v === text),
    });
  }

  handleSelectQty = (text) => {
    this.props.updateOrder({
      qty: +text,
    });
  }

  render() {
    const price = this.props.products[this.props.order.productId].price
      + (values(this.props.order.designs).length * 5);
    return (
      <form className={css.orderform}>
        <div><p className={css.pricelabel}>{`单价：¥ ${price.toFixed(2)}`}</p></div>
        <Dropdown
          label="数量" id="select-qty"
          value={this.props.order.qty}
          onSelect={this.handleSelectQty}
          items={range(1, 13)}
          error={this.props.error.qty}
        />
        <Dropdown
          label="尺码" id="select-size"
          value={SIZE_LOCALIZE_MAP[this.props.order.size]}
          onSelect={this.handleSelectSize}
          items={values(SIZE_LOCALIZE_MAP)}
          error={this.props.error.size}
        />
      </form>
    );
  }
}
