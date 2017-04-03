import { combineReducers } from 'redux';

import fetchStatus from './fetchStatus';
import entities from './entity';
import error from './error';
import cart from './cart';
import ui from './ui'

export default combineReducers({ entities, ui, fetchStatus, cart, error });
