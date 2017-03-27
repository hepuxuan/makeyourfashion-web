import {isEmpty} from 'lodash'
import {validateOrder} from './validation'
import {pickBy} from 'lodash'
import uuid from 'uuid/v4'

const TOGGLE_PRODUCT_MODEL = 'TOGGLE_PRODUCT_MODEL'
const TOGGLE_DESIGN_MODEL = 'TOGGLE_DESIGN_MODEL'
const UPDATE_ORDER = 'UPDATE_ORDER'
const START_FETCH_PRODUCT = 'START_FETCH_PRODUCT'
const FINISH_FETCH_PRODUCT = 'FINISH_FETCH_PRODUCT'
const START_FETCH_DESIGN = 'START_FETCH_DESIGN'
const FINISH_FETCH_DESIGN = 'FINISH_FETCH_DESIGN'
const START_FETCH_TAG = 'START_FETCH_TAG'
const FINISH_FETCH_TAG = 'FINISH_FETCH_TAG'
const REPLACE_PRODUCTS = 'REPLACE_PRODUCTS'
const ADD_TO_CART = 'ADD_TO_CART'
const UPDATE_CART_ITEM = 'UPDATE_CART_ITEM'
const REMOVE_ITEM_FROM_CART = 'REMOVE_ITEM_FROM_CART'
const ADD_DESIGNS_BY_TAG = 'ADD_DESIGNS_BY_TAG'
const ENTER_PREVIEW_MODE = 'ENTER_PREVIEW_MODE'
const ADD_SORTED_DESIGNS = 'ADD_SORTED_DESIGNS'
const REPLACE_TAGS = 'REPLACE_TAGS'

const startFetchProduct = {
  type: START_FETCH_PRODUCT
}

const finishFetchProduct = {
  type: FINISH_FETCH_PRODUCT
}

const startFetchDesign = {
  type: START_FETCH_DESIGN
}

const finishFetchDesign = {
  type: FINISH_FETCH_DESIGN
}

const startFetchTag = {
  type: START_FETCH_TAG
}

const finishFetchTag = {
  type: FINISH_FETCH_TAG
}

const toggleProductModel = {
  type: TOGGLE_PRODUCT_MODEL
}

const toggleDesignModel = {
  type: TOGGLE_DESIGN_MODEL
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
        ...getState().cart,
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
  return (dispatch, getState) => {
    const newOrder = {
      ...getState().ui.createOrder.order,
      ...payload
    }
    localStorage.setItem('currentOrder', JSON.stringify(newOrder))
    dispatch({
      type: UPDATE_ORDER,
      payload
    })
  }
}

function fetchProducts () {
  return (dispatch, getState) => {
    const state = getState()
    if (!state.fetchStatus.isFetchingProduct && isEmpty(state.entities.products)) {
      dispatch(startFetchProduct)
      // fetch('/product.json')  // uncomment this when running locally
      fetch('/makeyourfashion-web/product.json')
        .then(res => res.json())
        .then(products => {
          dispatch({
            type: REPLACE_PRODUCTS,
            payload: products
          })
          dispatch(finishFetchProduct)
        })
    }
  }
}

function fetchTags () {
  return (dispatch, getState) => {
    const state = getState()
    if (!state.fetchStatus.isFetchingTag && isEmpty(state.entities.tags.byIds)) {
      dispatch(startFetchTag)
      // fetch('/tag.json')  // uncomment this when running locally
      fetch('/makeyourfashion-web/tag.json')
        .then(res => res.json())
        .then(tags => { 
          dispatch({
            type: REPLACE_TAGS,
            payload: tags
          })
          dispatch(finishFetchTag)
        })
    }
  }
}

function fetchDesigns () {
  return (dispatch, getState) => {
    const state = getState()
    if (!state.fetchStatus.isFetchingDesign && isEmpty(state.entities.designs.byIds)) {
      dispatch(startFetchDesign)
      // fetch('/design.json')  // uncomment this when running locally
      fetch('/makeyourfashion-web/design.json')
        .then(res => res.json())
        .then(designs => {
          dispatch({
            type: ADD_SORTED_DESIGNS,
            payload: designs
          })
          dispatch(finishFetchDesign)
        })
    }
  }
}

function fetchDesignsByTag (tag) {
  return (dispatch, getState) => {
    const state = getState()
    if (isEmpty(state.entities.designs.byTags[tag])) {
      // fetch(`/design${tag}.json`)  // uncomment this when running locally
      fetch(`/makeyourfashion-web/design${tag}.json`)
        .then(res => res.json())
        .then(designs => {
          dispatch({
            type: ADD_DESIGNS_BY_TAG,
            payload: {
              designs,
              tag
            }
          })
        })
    }
  }
}

export {
  TOGGLE_PRODUCT_MODEL,
  TOGGLE_DESIGN_MODEL,
  UPDATE_ORDER,
  START_FETCH_PRODUCT,
  FINISH_FETCH_PRODUCT,
  START_FETCH_DESIGN,
  FINISH_FETCH_DESIGN,
  START_FETCH_TAG,
  FINISH_FETCH_TAG,
  REPLACE_PRODUCTS,
  ADD_TO_CART,
  UPDATE_CART_ITEM,
  REMOVE_ITEM_FROM_CART,
  ADD_DESIGNS_BY_TAG,
  ADD_SORTED_DESIGNS,
  ENTER_PREVIEW_MODE,
  REPLACE_TAGS,
  toggleProductModel,
  toggleDesignModel,
  updateOrder,
  fetchProducts,
  fetchDesigns,
  fetchTags,
  startFetchTag,
  finishFetchTag,
  addToCart,
  updateCartItem,
  removeItemFromCart,
  fetchDesignsByTag
}
