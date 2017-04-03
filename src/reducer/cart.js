// @flow
import { isEmpty, pickBy } from 'lodash';
import {
  ADD_TO_CART,
  UPDATE_CART_ITEM,
  REMOVE_ITEM_FROM_CART,
} from '../action';
import { validateOrder } from '../validation';

const initialState = JSON.parse(localStorage.getItem('myf_cart') || '{}');

function cart(state = initialState, action) {
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

export default cart;
