// @flow
import {
  TOGGLE_PRODUCT_MODEL,
  TOGGLE_DESIGN_MODEL,
  UPDATE_ORDER,
} from '../../action';

const orderString = localStorage.getItem('currentOrder');

const initialState = {
  order: orderString ? JSON.parse(orderString) : {
    size: null,
    productId: -1,
    qty: null,
    designs: [],
  },
  isProductModelOpen: false,
  isDesignModelOpen: false,
};

function createOrder(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_PRODUCT_MODEL:
      return {
        ...state,
        isProductModelOpen: !state.isProductModelOpen,
      };
    case TOGGLE_DESIGN_MODEL:
      return {
        ...state,
        isDesignModelOpen: !state.isDesignModelOpen,
      };
    case UPDATE_ORDER:
      return {
        ...state,
        order: {
          ...state.order,
          ...action.payload,
        },
      };
    default:
      return state;
  }
}

export default createOrder;
