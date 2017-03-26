import {ADD_DESIGNS_BY_TAG} from '../../action'
import {keyBy, pick} from 'lodash'
import { combineReducers } from 'redux'

const intitialState = {
  byIds: {
    0: {
      id: 0,
      imgUrl: "http://image3.spreadshirtmedia.com/image-server/v1/designs/11471651?width=150&height=150&version=1320836481&mediaType=webp",
      tag: "sport"
    }
  },
  byTags: {}
}

function byIds (state = intitialState.byIds, action) {
  switch(action.type) {
    case ADD_DESIGNS_BY_TAG:
      return {
        ...state,
        ...keyBy(action.payload.designs, 'id')
      }
    default:
      return state
  }
}

function byTags (state = intitialState.byTags, action) {
  switch(action.type) {
    case ADD_DESIGNS_BY_TAG:
      return {
        ...state,
        [action.payload.tag]: pick(action.designs, 'id')
      }
    default:
      return state
  }
}

export default combineReducers({byIds, byTags})
