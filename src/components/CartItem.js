// @flow

import React from 'react';
import { connect } from 'react-redux';
import { values, range, findKey } from 'lodash';
import { SIZE_LOCALIZE_MAP } from '../localize';
import css from './main.css';
import Dropdown from './Dropdown';
import { updateCartItem, fetchProducts, removeItemFromCart } from '../action';

class CartItem extends React.Component {
  componentDidMount() {
    this.props.fetchProducts();
  }

  getPrice = () => {
    const order = this.props.cart[this.props.orderId];
    return this.props.products.byIds[order.productId].price + (values(order.designs).length * 5);
  }

  props: {
    fetchProducts: () => void,
    products: any,
    cart: any,
    orderId: string,
    removeItemFromCart: (orderId: string) => void,
    updateCartItem: (cart: any) => void,
    error: any,
  }

  handleSelectQty = (qtyString: string) => {
    const qty = +qtyString;
    if (qty === 0) {
      this.props.removeItemFromCart(this.props.orderId);
    }

    this.props.updateCartItem({
      ...this.props.cart[this.props.orderId],
      qty: +qty,
    });
  }

  handleSelectSize = (size: string) => {
    this.props.updateCartItem({
      ...this.props.cart[this.props.orderId],
      size: findKey(SIZE_LOCALIZE_MAP, v => v === size),
    });
  }

  render() {
    const order = this.props.cart[this.props.orderId];
    const product = this.props.products.byIds[order.productId];
    const error = this.props.error[order.id] || {};
    return product ? (
      <div key={order.id} className={css.cartitem}>
        <img alt="product" className={css.img} src={order.imgUrl} />
        <div className={css.description}>
          <h6>{product.name}</h6>
          <div><p className={css.pricelabel}>{`¥ ${(this.getPrice() * order.qty).toFixed(2)}`}</p></div>
          <Dropdown
            label="数量" id={`shopping-cart-select-qty${order.id}`}
            value={order.qty}
            onSelect={this.handleSelectQty}
            items={range(0, 13)}
            error={error.qty}
          />
          <Dropdown
            label="尺码" id={`shopping-cart-select-size${order.id}`}
            value={SIZE_LOCALIZE_MAP[order.size]}
            onSelect={this.handleSelectSize}
            items={values(SIZE_LOCALIZE_MAP)}
            error={error.size}
          />
        </div>
      </div>
    ) : null;
  }
}

export default connect(state => ({
  cart: state.cart,
  products: state.entities.products,
  error: state.error.cart,
}), dispatch => ({
  removeItemFromCart(id) {
    dispatch(removeItemFromCart(id));
  },
  fetchProducts() {
    dispatch(fetchProducts());
  },
  updateCartItem(order) {
    dispatch(updateCartItem(order));
  },
}))(CartItem);
