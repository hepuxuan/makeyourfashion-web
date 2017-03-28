import React from 'react';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { Tabs, Tab, Grid, Cell, Textfield } from 'react-mdl';
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
      <Grid className="header">
        <Cell className="header-cell" col={6}>
          <Tabs activeTab={1}>
            <Tab className="header-tab">购物</Tab>
            <Tab className="header-tab">设计</Tab>
            <Tab className="header-tab">销售</Tab>
          </Tabs>
        </Cell>
        <Cell offset={2} col={2}>
          <Textfield
            value=""
            onChange={() => {
            }}
            label="Search"
            expandable
            expandableIcon="search"
          />
        </Cell>
        <Cell col={2}>
          <ShoppingCartButton />
        </Cell>
      </Grid>
      <CreateShirt />
    </div>
  </Provider>
);
ReactDOM.render(App, document.getElementById('root'));
