import React from 'react';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { Tabs, Tab } from 'react-mdl';
import reducer from './reducer';
import CreateShirt from './components/create-shirt';
import ShoppingCartButton from './components/ShoppingCartButton';

const store = createStore(
  reducer,
  applyMiddleware(thunk),
);

window.store = store;

const App = (
  <Provider store={store}>
    <div>
      <div className="header">
        <Tabs className="header-cell" activeTab={1}>
          <Tab className="header-tab">购物</Tab>
          <Tab className="header-tab">设计</Tab>
          <Tab className="header-tab">销售</Tab>
        </Tabs>
        <ShoppingCartButton className="shopping-cart-icon" />
      </div>
      <CreateShirt />
    </div>
  </Provider>
);
ReactDOM.render(App, document.getElementById('root'));
