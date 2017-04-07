// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Textfield, IconButton } from 'react-mdl';
import { range } from 'lodash';
import { toggleEditTextPanel, updateText } from '../../action';
import css from './create-shirt.css';
import Dropdown from '../Dropdown';

class TextEditPanel extends React.Component {
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
    showTextEdit: boolean,
    activeTextId: string,
    toggleEditTextPanel: () => void,
    updateText: (text: {}) => void,
    texts: {}
  }

  input: null | HTMLInputElement

  handleChangeText = (e: Event) => {
    e.preventDefault();
    if (e.target instanceof HTMLInputElement) {
      this.props.updateText({
        ...this.props.texts[this.props.activeTextId],
        text: e.target.value,
      });
    }
  }

  handleChangeFontSize = (size: string) => {
    this.props.updateText({
      ...this.props.texts[this.props.activeTextId],
      fontSize: +size,
    });
  }

  handleClose = (e: Event) => {
    e.preventDefault();
    this.props.toggleEditTextPanel(false);
  }

  render() {
    const text = this.props.texts[this.props.activeTextId];
    return this.props.showTextEdit ? (
      <div className={css.textform}>
        <IconButton onClick={this.handleClose} className={css.closebutton} name="cancel" />
        <form onSubmit={this.handleChangeText}>
          <Textfield
            ref={(r) => { this.input = r ? r.inputRef : null; }}
            label="编辑文字"
            floatingLabel
            value={text.text}
            onChange={this.handleChangeText}
          />
          <Dropdown
            label="字体大小" id="select-font-size"
            value={text.fontSize}
            onSelect={this.handleChangeFontSize}
            items={range(30, 46)}
          />
        </form>
      </div>
    ) : null;
  }
}

export default connect(
  state => ({
    showTextEdit: state.ui.createOrder.showTextEdit,
    activeTextId: state.ui.createOrder.activeTextId,
    texts: state.ui.createOrder.order.texts,
  }),
  dispatch => ({
    toggleEditTextPanel(payload) {
      dispatch(toggleEditTextPanel(payload));
    },
    updateText(payload) {
      dispatch(updateText(payload));
    },
  }),
)(TextEditPanel);
