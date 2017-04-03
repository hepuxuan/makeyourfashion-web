// @flow
import { combineReducers } from 'redux';
import products from './product';
import designs from './design';
import tags from './tag';
import categories from './category';

export default combineReducers({ products, designs, tags, categories });
