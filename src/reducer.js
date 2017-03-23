import {
	TOGGLE_PRODUCT_MODEL,
	UPDATE_ORDER,
	START_FETCH_PRODUCT,
	FINISH_FETCH_PRODUCT,
	REPLACE_PRODUCTS,
	ADD_TO_CART,
	UPDATE_CART_ITEM,
  REMOVE_ITEM_FROM_CART
} from './action'
import { combineReducers } from 'redux'
import {keyBy, isEmpty, pickBy} from 'lodash'
import {validateOrder, validateOrderWhenPresent} from './validation'

const initialState = {
	entities: {
		categories: {
			0: '男士',
			1: '女士'
		},
		products: {},
		cart: JSON.parse(localStorage.getItem('myf_cart') || '{}')
	},
	fetchStatus : {
		isFetchingProduct: false
	},
	error: {
		cart: {},
		order: {}
	},
	ui: {
		createOrder: {
			order: {
				size: null,
				productId: 0,
				qty: null,
				price: 10
			},
			isProductModelOpen: false
		}
	}
}

function fetchStatus (state = initialState.fetchStatus, action) {
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
    default:
      return state 
  }
}

function createOrder (state = initialState.ui.createOrder, action) {
  switch (action.type) {
    case TOGGLE_PRODUCT_MODEL:
      return {
        ...state,
        isProductModelOpen: !state.isProductModelOpen
      }
    case UPDATE_ORDER:
      return {
        ...state,
        order: {
        	...state.order,
        	...action.payload
        }
      }
    default:
      return state 
  }
}

function error (state = initialState.error, action) {
  switch (action.type) {
    case UPDATE_ORDER:
      return {
        ...state,
        order: validateOrderWhenPresent(action.payload)
      }
   	case ADD_TO_CART:
    	return {
    		...state,
    		order: validateOrder(action.payload)
    	}
    case UPDATE_CART_ITEM:
    	return {
    		...state,
    		cart: {
    			...cart,
    			[action.payload.id]: validateOrder(action.payload)
    		}
    	}
    default:
      return state 
  }
}

function products (state = initialState.entities.products, action) {
	switch (action.type) {
		case REPLACE_PRODUCTS:
			return {
				...state,
				...keyBy(action.payload, 'id')
			}
		default:
      return state 
	}
}

function cart (state = initialState.entities.cart, action) {
	switch (action.type) {
		case ADD_TO_CART:
		case UPDATE_CART_ITEM:
			if (isEmpty(validateOrder(action.payload))) {
				return {
					...state,
					[action.payload.id]: action.payload
				}
			} else {
				return state
			}
    case REMOVE_ITEM_FROM_CART:
      return pickBy(state, order => order.id !== action.payload)
		default:
      return state 
	}
}

function categories (state = initialState.entities.categories, action) {
	switch (action.type) {
		default:
      return state 
	}
}

const ui = combineReducers({createOrder})
const entities = combineReducers({products, categories, cart})

export default combineReducers({entities, ui, fetchStatus, error})
