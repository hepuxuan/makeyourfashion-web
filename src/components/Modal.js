// @flow

import React from 'react';
import dialogPolyfill from 'dialog-polyfill';
import { Dialog, FABButton, Icon } from 'react-mdl';
import type { Children } from 'react';
import css from './main.css';

class Modal extends React.Component {
  componentDidMount() {
    dialogPolyfill.registerDialog(this.dialog.dialogRef);
  }

  props: {
    onCloseModal: () => void,
    open: boolean,
    children: Children
  }

  dialog: {
    dialogRef: {}
  }

  render() {
    const { onCloseModal, open, children } = this.props;
    return (
      <Dialog
        ref={(ref) => { this.dialog = ref; }}
        className={css.modal} onCancel={onCloseModal} open={open}
      >
        {children}
        <FABButton onClick={onCloseModal} className={css.closemodal} mini colored>
          <Icon name="close" />
        </FABButton>
      </Dialog>
    );
  }
}

export default Modal;
