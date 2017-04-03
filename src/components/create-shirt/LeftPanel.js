// @flow
import React from 'react';
import { FABButton, Icon, List, ListItem } from 'react-mdl';
import { connect } from 'react-redux';
import { toggleProductModel, toggleDesignModel, fetchProducts } from '../../action';
import css from './create-shirt.css';

class LeftPanel extends React.Component {
  componentDidMount() {
    this.props.fetchProducts();
  }

  props: {
    toggleProductModel: () => void,
    toggleDesignModel: () => void,
    fetchProducts: () => void,
    products: any,
    order: any,
  }

  handleSelectProduct = (e) => {
    e.preventDefault();
    this.props.toggleProductModel();
  }

  handleSelectDesign = (e) => {
    e.preventDefault();
    this.props.toggleDesignModel();
  }

  handleAddText = (e) => {
    e.preventDefault();
  }

  render() {
    const product = this.props.products.byIds[this.props.order.productId];
    return (
      <div>
        <p className={css.productname}>{product ? product.name : '请选择产品'}</p>
        <List>
          <ListItem>
            <div className={css.label}>
              <FABButton onClick={this.handleSelectProduct} mini name="select-product">
                <Icon name="collections" />
              </FABButton>
              <label htmlFor="select-product"> 选择产品 </label>
            </div>
          </ListItem>
          <ListItem>
            <div className={css.label}>
              <FABButton onClick={this.handleSelectDesign} mini name="select-design">
                <Icon name="insert_photo" />
              </FABButton>
              <label htmlFor="select-design"> 选择设计 </label>
            </div>
          </ListItem>
          <ListItem>
            <div className={css.label}>
              <FABButton onClick={this.handleAddText} mini name="add-text">
                <Icon name="title" />
              </FABButton>
              <label htmlFor="add-text"> 添加文字 </label>
            </div>
          </ListItem>
        </List>
      </div>
    );
  }
}

export default connect(state => ({
  products: state.entities.products,
  order: state.ui.createOrder.order,
}), dispatch => ({
  toggleProductModel() {
    dispatch(toggleProductModel);
  },
  toggleDesignModel() {
    dispatch(toggleDesignModel);
  },
  fetchProducts() {
    dispatch(fetchProducts());
  },
}))(LeftPanel);
