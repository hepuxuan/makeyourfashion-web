import { combineReducers } from 'redux';
import { keyBy, isEmpty, pickBy } from 'lodash';
import {
  TOGGLE_PRODUCT_MODEL,
  TOGGLE_DESIGN_MODEL,
  UPDATE_ORDER,
  REPLACE_PRODUCTS,
  ADD_TO_CART,
  UPDATE_CART_ITEM,
  REMOVE_ITEM_FROM_CART,
} from '../action';

import { validateOrder, validateOrderWhenPresent } from '../validation';
import designs from './entity/design';
import tags from './entity/tag';
import fetchStatus from './fetchStatus';

const initialState = {
  entities: {
    categories: {
      0: '男士',
      1: '女士',
    },
    products: {},
  },
  cart: JSON.parse(localStorage.getItem('myf_cart') || '{}'),
  error: {
    cart: {},
    order: {},
  },
  ui: {
    createOrder: {
      order: JSON.parse(localStorage.getItem('currentOrder')) || {
        size: null,
        productId: 0,
        qty: null,
        price: 10,
        designs: [],
      },
      isProductModelOpen: false,
      isDesignModelOpen: false,
    },
  },
};

function createOrder(state = initialState.ui.createOrder, action) {
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

function error(state = initialState.error, action) {
  switch (action.type) {
    case UPDATE_ORDER:
      return {
        ...state,
        order: validateOrderWhenPresent(action.payload),
      };
    case ADD_TO_CART:
      return {
        ...state,
        order: validateOrder(action.payload),
      };
    case UPDATE_CART_ITEM:
      return {
        ...state,
        cart: {
          ...state.cart,
          [action.payload.id]: validateOrder(action.payload),
        },
      };
    default:
      return state;
  }
}

function products(state = initialState.entities.products, action) {
  switch (action.type) {
    case REPLACE_PRODUCTS:
      return {
        ...state,
        ...keyBy(action.payload, 'id'),
      };
    default:
      return state;
  }
}

function cart(state = initialState.cart, action) {
  switch (action.type) {
    case ADD_TO_CART:
    case UPDATE_CART_ITEM:
      if (isEmpty(validateOrder(action.payload))) {
        return {
          ...state,
          [action.payload.id]: action.payload,
        };
      }
      return state;
    case REMOVE_ITEM_FROM_CART:
      return pickBy(state, order => order.id !== action.payload);
    default:
      return state;
  }
}

function categories(state = initialState.entities.categories, action) {
  switch (action.type) {
    default:
      return state;
  }
}

const ui = combineReducers({ createOrder });
const entities = combineReducers({ products, designs, tags, categories });

export default combineReducers({ entities, ui, fetchStatus, cart, error });
