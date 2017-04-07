// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Textfield, Button, IconButton } from 'react-mdl';
import { range } from 'lodash';
import { addText, toggleAddTextPanel } from '../../action';
import css from './create-shirt.css';
import Dropdown from '../Dropdown';

class TextSettingsPanel extends React.Component {
  state = {
    text: '',
    fontSize: 30,
  }

  componentDidMount() {
    if (this.input) {
      this.input.focus();
    }
  }

  componentDidUpdate() {
    if (this.input) {
      this.input.focus();
    }
  }

  props: {
    showTextSettings: boolean,
    addText: (s: {}) => void,
    toggleAddTextPanel: () => void,
  }

  input: null | HTMLInputElement

  handleChangeText = (e: Event) => {
    if (e.target instanceof HTMLInputElement) {
      this.setState({
        text: e.target.value,
      });
    }
  }

  handleClick = (e: Event) => {
    e.preventDefault();
    this.props.addText({
      text: this.state.text,
      x: 250,
      y: 625,
      fontSize: 40,
    });
    this.setState({
      text: '',
    });
    this.props.toggleAddTextPanel();
  }

  handleClose = (e: Event) => {
    e.preventDefault();
    this.props.toggleAddTextPanel();
  }

  handleChangeFontSize = (fontSize: string) => {
    this.setState({
      fontSize: +fontSize,
    });
  }

  render() {
    return this.props.showTextSettings ? (
      <div className={css.textform}>
        <IconButton onClick={this.handleClose} className={css.closebutton} name="cancel" />
        <form onSubmit={this.handleClick}>
          <Textfield
            ref={(r) => { this.input = r ? r.inputRef : null; }}
            label="请输入文字"
            floatingLabel
            value={this.state.text}
            onChange={this.handleChangeText}
          />
          <Dropdown
            label="字体大小" id="select-font-size"
            value={this.state.fontSize.toString()}
            onSelect={this.handleChangeFontSize}
            items={range(30, 46)}
          />
          <Button
            style={{ marginTop: '20px' }}
            raised colored ripple primary
            onClick={this.handleClick}
          >添加</Button>
        </form>
      </div>
    ) : null;
  }
}

export default connect(
  state => ({
    showTextSettings: state.ui.createOrder.showTextSettings,
  }),
  dispatch => ({
    addText(text) {
      dispatch(addText(text));
    },
    toggleAddTextPanel() {
      dispatch(toggleAddTextPanel);
    },
  }),
)(TextSettingsPanel);
