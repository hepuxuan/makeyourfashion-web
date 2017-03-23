import {isEmpty} from 'lodash'
import {validateOrder} from './validation'
import {pickBy} from 'lodash'
import uuid from 'uuid/v4'

const TOGGLE_PRODUCT_MODEL = 'TOGGLE_PRODUCT_MODEL'
const UPDATE_ORDER = 'UPDATE_ORDER'
const START_FETCH_PRODUCT = 'START_FETCH_PRODUCT'
const FINISH_FETCH_PRODUCT = 'FINISH_FETCH_PRODUCT'
const REPLACE_PRODUCTS = 'REPLACE_PRODUCTS'
const ADD_TO_CART = 'ADD_TO_CART'
const UPDATE_CART_ITEM = 'UPDATE_CART_ITEM'
const REMOVE_ITEM_FROM_CART = 'REMOVE_ITEM_FROM_CART'

const startFetchProduct = {
  type: START_FETCH_PRODUCT
}

const finishFetchProduct = {
  type: FINISH_FETCH_PRODUCT
}

const toggleProductModel = {
  type: TOGGLE_PRODUCT_MODEL
}

function updateCartItem (payload) {
  return (dispatch, getState) => {
    if (isEmpty(validateOrder(payload))) {
      const newCart = {
        ...getState().entities.cart,
        [payload.id]: payload
      }
      localStorage.setItem('myf_cart', JSON.stringify(newCart))
    }
    dispatch({
      type: UPDATE_CART_ITEM,
      payload
    })
  }
}

function removeItemFromCart (payload) {
  return (dispatch, getState) => {
    const id = payload
    const newCart = pickBy(getState().entities.cart, order => order.id !== id)
    localStorage.setItem('myf_cart', JSON.stringify(newCart))
    dispatch({
      type: REMOVE_ITEM_FROM_CART,
      payload
    })
  }
}

function addToCart (payload) {
  return (dispatch, getState) => {
    const id = uuid()
    payload.id = id
    if (isEmpty(validateOrder(payload))) {
      const newCart = {
        ...getState().entities.cart,
        [id]: payload
      }
      localStorage.setItem('myf_cart', JSON.stringify(newCart))
    }
    dispatch({
      type: ADD_TO_CART,
      payload
    })
  }
}

function updateOrder (payload) {
  return {
    type: UPDATE_ORDER,
    payload
  }
}

function replaceProducts (payload) {
  return {
    type: REPLACE_PRODUCTS,
    payload
  }
}

function fetchProducts () {
  return (dispatch, getState) => {
    const state = getState()
    if (!state.fetchStatus.isFetchingProduct && isEmpty(state.entities.products)) {
      dispatch(startFetchProduct)
      // fetch('/product.json') // uncomment this when running locally
      fetch('/makeyourfashion-web/product.json')
        .then(res => res.json())
        .then(procuts => {
          dispatch(replaceProducts(procuts))
          dispatch(finishFetchProduct)
        })
    }
  }
}

export {
  TOGGLE_PRODUCT_MODEL,
  UPDATE_ORDER,
  START_FETCH_PRODUCT,
  FINISH_FETCH_PRODUCT,
  REPLACE_PRODUCTS,
  ADD_TO_CART,
  UPDATE_CART_ITEM,
  REMOVE_ITEM_FROM_CART,
  toggleProductModel,
  updateOrder,
  fetchProducts,
  addToCart,
  updateCartItem,
  removeItemFromCart
}
