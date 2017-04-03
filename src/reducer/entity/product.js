// @flow
import { keyBy } from 'lodash';
import { combineReducers } from 'redux';
import { REPLACE_PRODUCTS } from '../../action';

const initialState = {
  byIds: {},
};

function byIds(state = initialState.byIds, action) {
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

export default combineReducers({ byIds });
