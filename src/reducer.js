import {TOGGLE_PRODUCT_MODEL, UPDATE_ORDER} from './action'
import { combineReducers } from 'redux'

const initialState = {
	entities: {
		categories: {
			0: '男士',
			1: '女士'
		},
		products: {
			0: {
				id: 0,
				category: 0,
				name: '男士体恤',
				imgUrl: 'https://image1.spreadshirtmedia.com/image-server/v1/productTypes/812/views/1/appearances/92?width=800&height=800&mediaType=webp'
			},
			1: {
				id: 1,
				category: 1,
				name: '女士体恤',
				imgUrl: 'https://image2.spreadshirtmedia.com/image-server/v1/productTypes/813/views/1/appearances/92?width=800&height=800&mediaType=webp'
			}
		}
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

function products (state = initialState.entities.products, action) {
	switch (action.type) {
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
const entities = combineReducers({products, categories})

export default combineReducers({entities, ui})
