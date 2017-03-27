import {
  START_FETCH_PRODUCT,
  FINISH_FETCH_PRODUCT,
  START_FETCH_DESIGN,
  FINISH_FETCH_DESIGN,
  START_FETCH_TAG,
  FINISH_FETCH_TAG
} from '../action'

const initialState = {
  isFetchingProduct: false,
  isFetchingDesign: false,
  isFetchingTag: false
}

export default function fetchStatus (state = initialState, action) {
  switch (action.type) {
    case START_FETCH_PRODUCT:
      return {
        ...state,
        isFetchingProduct: true
      }
    case FINISH_FETCH_PRODUCT:
      return {
        ...state,
        isFetchingProduct: false
      }
    case START_FETCH_DESIGN:
      return {
        ...state,
        isFetchingDesign: true
      }
    case FINISH_FETCH_DESIGN:
      return {
        ...state,
        isFetchingDesign: false
      }
    case START_FETCH_TAG:
      return {
        ...state,
        isFetchingTag: true
      }
    case FINISH_FETCH_TAG:
      return {
        ...state,
        isFetchingTag: false
      }
    default:
      return state 
  }
}
