// @flow
import {
  TOGGLE_PRODUCT_MODEL,
  TOGGLE_DESIGN_MODEL,
  UPDATE_ORDER,
  TOGGLE_ADD_TEXT_PANEL,
  UPDATE_ACTIVE_TEXT_ID,
  TOGGLE_EDIT_TEXT_PANEL,
} from '../../action';

const orderString = localStorage.getItem('currentOrder');

const initialState = {
  order: orderString ? JSON.parse(orderString) : {
    size: null,
    productId: -1,
    qty: null,
    designs: {},
    texts: {},
  },
  isProductModelOpen: false,
  isDesignModelOpen: false,
  showTextSettings: false,
  showTextEdit: false,
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
    case UPDATE_ACTIVE_TEXT_ID:
      return {
        ...state,
        activeTextId: action.payload,
      };
    case TOGGLE_ADD_TEXT_PANEL:
      if (state.showTextEdit === true) {
        return {
          ...state,
          showTextSettings: !state.showTextSettings,
          showTextEdit: false,
        };
      }
      return {
        ...state,
        showTextSettings: !state.showTextSettings,
      };
    case TOGGLE_EDIT_TEXT_PANEL:
      if (state.showTextSettings === true) {
        return {
          ...state,
          showTextEdit: action.payload,
          showTextSettings: false,
        };
      }
      return {
        ...state,
        showTextEdit: action.payload,
      };
    default:
      return state;
  }
}

export default createOrder;
