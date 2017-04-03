// @flow

import React from 'react';
import { connect } from 'react-redux';
import { Icon, Badge } from 'react-mdl';
import { map, values, sum, isEmpty } from 'lodash';
import css from './main.css';
import CartItem from './CartItem';

class ShoppingCartButton extends React.Component {
  state = {
    display: 'none',
  }

  props: {
    cart: any,
  }

  hideCallbackHandle: number

  handleMouseEnter = () => {
    this.setState({
      display: 'block',
    });
    if (this.hideCallbackHandle) {
      clearTimeout(this.hideCallbackHandle);
    }
  }

  handleMouseLeave = () => {
    this.hideCallbackHandle = window.setTimeout(() => {
      this.setState({
        display: 'none',
      });
    }, 500);
  }

  render() {
    return (
      <div
        className={css.shoppingcart}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <Badge className="cart-icon" text={sum(map(this.props.cart, order => order.qty))} overlap>
          <Icon name="shopping_cart" />
        </Badge>
        <div className={css.cartmenu} style={{ display: this.state.display }} align="right">
          {
            isEmpty(this.props.cart) ? <p>您的购物车为空</p> : <div>
              {values(this.props.cart).map(order => <CartItem orderId={order.id} />)}
              <div className={css.actionsection}>
                <a
                  href="/checkout"
                  className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--raised mdl-button--accent"
                >结账</a>
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  cart: state.cart,
}))(ShoppingCartButton);
