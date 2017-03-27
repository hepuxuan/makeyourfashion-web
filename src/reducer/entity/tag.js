import {REPLACE_TAGS} from '../../action'
import { combineReducers } from 'redux'
import {keyBy} from 'lodash'

const initialState = {
  byIds: {},
  allIds: []
}

function byIds (state = initialState.byIds, action) {
  switch (action.type) {
    case REPLACE_TAGS:
      return keyBy(action.payload, 'id')
    default:
      return state 
  }
}

function allIds (state = initialState.allIds, action) {
  switch (action.type) {
    case REPLACE_TAGS:
      return action.payload.map(tag => tag.id)
    default:
      return state 
  }
}

export default combineReducers({byIds, allIds})
