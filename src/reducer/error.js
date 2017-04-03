import { combineReducers } from 'redux';
import {
  UPDATE_ORDER,
  ADD_TO_CART,
  UPDATE_CART_ITEM,
} from '../action';
import { validateOrder, validateOrderWhenPresent } from '../validation';

function cart(state = {}, action) {
  switch (action.type) {
    case UPDATE_CART_ITEM:
      return {
        ...state.cart,
        [action.payload.id]: validateOrder(action.payload),
      };
    default:
      return state;
  }
}

function order(state = {}, action) {
  switch (action.type) {
    case UPDATE_ORDER:
      return validateOrderWhenPresent(action.payload);
    case ADD_TO_CART:
      return validateOrder(action.payload);
    default:
      return state;
  }
}


export default combineReducers({ cart, order });
