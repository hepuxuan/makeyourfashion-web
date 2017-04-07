import { isEmpty, pickBy, omit } from 'lodash';
import uuid from 'uuid/v4';
import { validateOrder } from './validation';
import { host } from './config';

const TOGGLE_PRODUCT_MODEL = 'TOGGLE_PRODUCT_MODEL';
const TOGGLE_DESIGN_MODEL = 'TOGGLE_DESIGN_MODEL';
const UPDATE_ORDER = 'UPDATE_ORDER';
const START_FETCH_PRODUCT = 'START_FETCH_PRODUCT';
const FINISH_FETCH_PRODUCT = 'FINISH_FETCH_PRODUCT';
const START_FETCH_DESIGN = 'START_FETCH_DESIGN';
const FINISH_FETCH_DESIGN = 'FINISH_FETCH_DESIGN';
const START_FETCH_TAG = 'START_FETCH_TAG';
const FINISH_FETCH_TAG = 'FINISH_FETCH_TAG';
const REPLACE_PRODUCTS = 'REPLACE_PRODUCTS';
const ADD_TO_CART = 'ADD_TO_CART';
const UPDATE_CART_ITEM = 'UPDATE_CART_ITEM';
const REMOVE_ITEM_FROM_CART = 'REMOVE_ITEM_FROM_CART';
const ADD_DESIGNS_BY_TAG = 'ADD_DESIGNS_BY_TAG';
const ENTER_PREVIEW_MODE = 'ENTER_PREVIEW_MODE';
const ADD_SORTED_DESIGNS = 'ADD_SORTED_DESIGNS';
const REPLACE_TAGS = 'REPLACE_TAGS';
const REMOVE_DESIGN = 'REMOVE_DESIGN';
const TOGGLE_ADD_TEXT_PANEL = 'TOGGLE_ADD_TEXT_PANEL';
const UPDATE_ACTIVE_TEXT_ID = 'UPDATE_ACTIVE_TEXT_ID';
const TOGGLE_EDIT_TEXT_PANEL = 'TOGGLE_EDIT_TEXT_PANEL'

const toggleProductModel = {
  type: TOGGLE_PRODUCT_MODEL,
};

const toggleDesignModel = {
  type: TOGGLE_DESIGN_MODEL,
};

const toggleAddTextPanel = {
  type: TOGGLE_ADD_TEXT_PANEL,
};

function toggleEditTextPanel(payload) {
  return {
    type: TOGGLE_EDIT_TEXT_PANEL,
    payload
  }
}

function updateActiveTextId(id) {
  return {
    type: UPDATE_ACTIVE_TEXT_ID,
    payload: id,
  };
}

function updateOrder(payload) {
  return (dispatch, getState) => {
    const newOrder = {
      ...getState().ui.createOrder.order,
      ...payload,
    };
    localStorage.setItem('currentOrder', JSON.stringify(newOrder));
    dispatch({
      type: UPDATE_ORDER,
      payload,
    });
  };
}

function updateText(payload: {}) {
  return (dispatch, getState) => {
    dispatch(updateOrder({
      texts: {
        ...getState().ui.createOrder.order.texts,
        [payload.id]: payload,
      },
    }));
  };
}

function removeText(id: number) {
  return (dispatch, getState) => {
    dispatch(updateOrder({
      texts: omit(getState().ui.createOrder.order.texts, id),
    }));
  };
}

function addText(payload) {
  return (dispatch) => {
    dispatch(updateText({
      ...payload,
      id: uuid(),
    }));
  };
}

function removeDesign(id: number) {
  return {
    type: REMOVE_DESIGN,
    payload: id,
  };
}

function updateCartItem(payload) {
  return (dispatch, getState) => {
    if (isEmpty(validateOrder(payload))) {
      const newCart = {
        ...getState().entities.cart,
        [payload.id]: payload,
      };
      localStorage.setItem('myf_cart', JSON.stringify(newCart));
    }
    dispatch({
      type: UPDATE_CART_ITEM,
      payload,
    });
  };
}

function removeItemFromCart(payload) {
  return (dispatch, getState) => {
    const id = payload;
    const newCart = pickBy(getState().entities.cart, order => order.id !== id);
    localStorage.setItem('myf_cart', JSON.stringify(newCart));
    dispatch({
      type: REMOVE_ITEM_FROM_CART,
      payload,
    });
  };
}

function addToCart(payload) {
  return (dispatch, getState) => {
    const id = uuid();
    const newItem = {
      ...payload,
      id,
    };
    if (isEmpty(validateOrder(newItem))) {
      const newCart = {
        ...getState().cart,
        [id]: newItem,
      };
      localStorage.setItem('myf_cart', JSON.stringify(newCart));
    }
    dispatch({
      type: ADD_TO_CART,
      payload: newItem,
    });
  };
}

function fetchProducts() {
  return (dispatch, getState) => {
    const state = getState();
    if (!state.fetchStatus.isFetchingProduct && isEmpty(state.entities.products.byIds)) {
      dispatch({
        type: START_FETCH_PRODUCT,
      });
      fetch(`${host}product.json`)
        .then(res => res.json())
        .then((products) => {
          dispatch({
            type: REPLACE_PRODUCTS,
            payload: products,
          });
          dispatch({
            type: FINISH_FETCH_PRODUCT,
          });
        });
    }
  };
}

function fetchTags() {
  return (dispatch, getState) => {
    const state = getState();
    if (!state.fetchStatus.isFetchingTag && isEmpty(state.entities.tags.byIds)) {
      dispatch({
        type: START_FETCH_TAG,
      });
      fetch(`${host}tag.json`)
        .then(res => res.json())
        .then((tags) => {
          dispatch({
            type: REPLACE_TAGS,
            payload: tags,
          });
          dispatch({
            type: FINISH_FETCH_TAG,
          });
        });
    }
  };
}

function fetchDesigns() {
  return (dispatch, getState) => {
    const state = getState();
    if (!state.fetchStatus.isFetchingDesign && isEmpty(state.entities.designs.byIds)) {
      dispatch({
        type: START_FETCH_DESIGN,
      });
      fetch(`${host}design.json`)
        .then(res => res.json())
        .then((designs) => {
          dispatch({
            type: ADD_SORTED_DESIGNS,
            payload: designs,
          });
          dispatch({
            type: FINISH_FETCH_DESIGN,
          });
        });
    }
  };
}

function fetchDesignsByTag(tag) {
  return (dispatch, getState) => {
    const state = getState();
    if (isEmpty(state.entities.designs.byTags[tag])) {
      fetch(`${host}design${tag}.json`)
        .then(res => res.json())
        .then((designs) => {
          dispatch({
            type: ADD_DESIGNS_BY_TAG,
            payload: {
              designs,
              tag,
            },
          });
        });
    }
  };
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
  TOGGLE_ADD_TEXT_PANEL,
  REPLACE_TAGS,
  UPDATE_ACTIVE_TEXT_ID,
  TOGGLE_EDIT_TEXT_PANEL,
  toggleProductModel,
  toggleDesignModel,
  updateOrder,
  fetchProducts,
  fetchDesigns,
  fetchTags,
  addToCart,
  updateCartItem,
  removeItemFromCart,
  fetchDesignsByTag,
  removeDesign,
  addText,
  updateText,
  toggleAddTextPanel,
  toggleEditTextPanel,
  updateActiveTextId,
  removeText,
};
