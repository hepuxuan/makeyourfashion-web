import React from 'react'
import css from './main.css'
import {Button, Menu, MenuItem, ListItem, Grid, Cell, Icon} from 'react-mdl'

export default class Dropdown extends React.Component {
	handleSelect = e => {
		e.preventDefault()
		this.props.onSelect(e.target.innerHTML)
	}

	handleButtonClick = e => {
		e.preventDefault()
	}

	render () {
		const {label, items, id, error} = this.props
		return <div>
		  <Button onClick={this.handleButtonClick} raised colored id={id}>
		  	{`${label}: ${this.props.value || ''}`}
		  	<Icon name='keyboard_arrow_down' />
		  </Button>
		  <span className={css.error}>{error}</span>
		  <Menu onClick={this.handleSelect} target={id}>
		  	{items.map((item, index) => <MenuItem key={index}>{item}</MenuItem>)}
		  </Menu>
		</div>
	}
}
