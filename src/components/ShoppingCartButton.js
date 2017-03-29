import React from 'react';
import { connect } from 'react-redux';
import { Icon, Badge } from 'react-mdl';
import { map, values, sum, range, findKey, isEmpty } from 'lodash';
import { SIZE_LOCALIZE_MAP } from '../localize';
import css from './main.css';
import Dropdown from './Dropdown';
import { updateCartItem, fetchProducts, removeItemFromCart } from '../action';

@connect(state => ({
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
}))
class CartItem extends React.Component {
  componentDidMount() {
    this.props.fetchProducts();
  }

  handleSelectQty = (qtyString) => {
    const qty = +qtyString
    if (qty === 0) {
      this.props.removeItemFromCart(this.props.orderId)
    }

    this.props.updateCartItem({
      ...this.props.cart[this.props.orderId],
      qty: +qty,
    });
  }

  handleSelectSize = (size) => {
    this.props.updateCartItem({
      ...this.props.cart[this.props.orderId],
      size: findKey(SIZE_LOCALIZE_MAP, v => v === size),
    });
  }

  render() {
    const order = this.props.cart[this.props.orderId];
    const product = this.props.products[order.productId];
    const error = this.props.error[order.id] || {};
    return product ? <div key={order.id} className={css.cartitem}>
      <img className={css.img} src={order.imgUrl} />
      <div className={css.description}>
        <h6>{product.name}</h6>
        <div><label className={css.pricelabel}>{`¥ ${(order.price * order.qty).toFixed(2)}`}</label></div>
        <Dropdown label='数量' id={`shopping-cart-select-qty${order.id}`}
          value={order.qty}
          onSelect={this.handleSelectQty}
          items={range(0, 13)}
          error={error.qty} />
        <Dropdown label='尺码' id={`shopping-cart-select-size${order.id}`}
          value={SIZE_LOCALIZE_MAP[order.size]}
          onSelect={this.handleSelectSize}
          items={values(SIZE_LOCALIZE_MAP)}
          error={error.size} />
      </div>
    </div>: null
  }
}

@connect(state => ({
  cart: state.cart
}))
export default class ShoppingCartButton extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      display: 'none'
    }
  }

  handleMouseEnter = e => {
    this.setState({
      display: 'block'
    })
    if (this.hidecb) {
      clearTimeout(this.hidecb)
    }
  }

  handleMouseLeave = e => {
    this.hidecb = setTimeout(() => {
      this.setState({
        display: 'none'
      })
    }, 500)
  }

  render () {
    return <div className={css.shoppingcart} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
      <Badge className='cart-icon' text={sum(map(this.props.cart, order => order.qty))} overlap>
        <Icon id='shopping-cart-icon' name='shopping_cart' />
      </Badge>
      <div className={css.cartmenu} target='shopping-cart-icon' style={{display: this.state.display }} align='right'>
        {
          isEmpty(this.props.cart) ? <p>您的购物车为空</p> : <div>
            {values(this.props.cart).map(order => <CartItem orderId={order.id} />)}
            <div className={css.actionsection}>
              <a href='/checkout'
                className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--raised mdl-button--accent">结账</a>
            </div>
          </div>
        }
      </div>
    </div>
  }
}
