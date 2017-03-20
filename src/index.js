import React from 'react'
import ReactDOM from 'react-dom'
import CreateShirt from './components/create-shirt'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import reducer from './reducer'
import {Tabs, Tab, Grid, Cell, Textfield, Icon, Badge} from 'react-mdl'

const store = createStore(
  reducer,
  applyMiddleware(thunk)
)

window.store = store

const App = (
	<Provider store={store}>
		<div>
			<Grid className='header'>
				<Cell className='header-cell' col={6}>
					<Tabs activeTab={1}>
			      <Tab className='header-tab'>购物</Tab>
			      <Tab className='header-tab'>设计</Tab>
			      <Tab className='header-tab'>销售</Tab>
			    </Tabs>
		    </Cell>
		    <Cell offset={2} col={2}>
		    	<Textfield
            value=""
            onChange={() => {}}
            label="Search"
            expandable
            expandableIcon="search"
          />
		    </Cell>
		    <Cell col={2}>
		    	<a href='/cart'>
			    	<Badge className='cart-icon' text="1" overlap>
					    <Icon name='shopping_cart' />
						</Badge>
					</a>
		    </Cell>
			</Grid>
			<CreateShirt />
		</div>
  </Provider>
)
ReactDOM.render(App, document.getElementById('root'))
