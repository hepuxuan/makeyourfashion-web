// @flow
import React from 'react';
import { Button, Menu, MenuItem, Icon } from 'react-mdl';
import css from './main.css';

export default class Dropdown extends React.Component {
  static defaultProps = {
    error: '',
  }

  props: {
    onSelect: (s: string) => void,
    label: string,
    items: Array<string>,
    id: string,
    error?: string,
    value: string | number,
  }

  handleSelect = (e: MouseEvent) => {
    e.preventDefault();
    if (e.target instanceof Element) {
      this.props.onSelect(e.target.innerHTML);
    }
  }

  handleButtonClick = (e: MouseEvent) => {
    e.preventDefault();
  }

  render() {
    const { label, items, id, error, value } = this.props;
    return (
      <div className={css.dropdown}>
        <Button
          mdPreventMenuClose
          className={css.dropdownbutton}
          onClick={this.handleButtonClick} raised colored id={id}
        >
          <span>{`${label}: ${value || ''}`}</span>
          <span className={css.arrowicon}><Icon name="keyboard_arrow_down" /></span>
        </Button>
        <span className={css.error}>{error}</span>
        <Menu onClick={this.handleSelect} target={id}>
          {items.map(item => <MenuItem key={item}>{item}</MenuItem>)}
        </Menu>
      </div>
    );
  }
}
