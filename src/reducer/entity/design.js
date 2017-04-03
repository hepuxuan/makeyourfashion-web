// @flow

import { keyBy } from 'lodash';
import { combineReducers } from 'redux';
import { ADD_DESIGNS_BY_TAG, ADD_SORTED_DESIGNS } from '../../action';

const intitialState = {
  byIds: {},
  byTags: {},
  byPopularity: [],
};

function byIds(state = intitialState.byIds, action) {
  switch (action.type) {
    case ADD_SORTED_DESIGNS:
      return {
        ...state,
        ...keyBy(action.payload, 'id'),
      };
    case ADD_DESIGNS_BY_TAG:
      return {
        ...state,
        ...keyBy(action.payload.designs, 'id'),
      };
    default:
      return state;
  }
}

function byTags(state = intitialState.byTags, action) {
  switch (action.type) {
    case ADD_DESIGNS_BY_TAG:
      return {
        ...state,
        [action.payload.tag]: action.payload.designs.map(tag => tag.id),
      };
    default:
      return state;
  }
}

function byPopularity(state = intitialState.byPopularity, action) {
  switch (action.type) {
    case ADD_SORTED_DESIGNS:
      return action.payload.map(design => design.id);
    default:
      return state;
  }
}

export default combineReducers({ byIds, byTags, byPopularity });
