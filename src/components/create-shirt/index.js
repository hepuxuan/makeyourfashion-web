// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Grid, Cell, Button, Spinner } from 'react-mdl';
import CreateShirtCanvas from './CreateShirtCanvas';
import css from './create-shirt.css';
import LeftPanel from './LeftPanel';
import SelectProduct from './SelectProduct';
import SelectDesign from './SelectDesign';
import OrderForm from './OrderForm';
import { fetchProducts, addToCart } from '../../action';

class CreateShirt extends React.Component {
  componentDidMount() {
    this.props.fetchProducts();
  }

  props: {
    fetchProducts: () => void,
    addToCart: (any) => void,
    order: {
      productId: number
    },
    products: any
  }

  handleAddToCard = (e: Event) => {
    e.preventDefault();
    this.props.addToCart({
      ...this.props.order,
      // use the actual image from backend
      imgUrl: this.props.products.byIds[this.props.order.productId].imgUrl,
    });
  }

  render() {
    return (
      <div>
        <SelectProduct />
        <SelectDesign />
        <Grid className={css.container}>
          <Cell col={3}>
            <LeftPanel />
          </Cell>
          <Cell col={6}>
            <CreateShirtCanvas />
          </Cell>
          <Cell col={3}>
            <OrderForm />
          </Cell>
        </Grid>
        <div className={css.actionarea}>
          <Button
            onClick={this.handleAddToCard}
            className={css.actionbutton} accent ripple raised
          >添加到购物车</Button>
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  products: state.entities.products,
  order: state.ui.createOrder.order,
}), dispatch => ({
  fetchProducts() {
    dispatch(fetchProducts());
  },
  addToCart(order) {
    dispatch(addToCart(order));
  },
}))(CreateShirt);
