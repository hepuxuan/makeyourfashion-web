import React from 'react'
import css from './main.css'
import {Dialog, FABButton, Icon} from 'react-mdl'
import dialogPolyfill from 'dialog-polyfill'

class Modal extends React.Component {
  componentDidMount () {
    dialogPolyfill.registerDialog(this.refs.dialog.dialogRef)
  }

  render () {
    const {onCloseModal, open, children} = this.props
    return <Dialog ref='dialog' className={css.modal} onCancel={onCloseModal} open={open}>
        {children}
        <FABButton onClick={onCloseModal} className={css.closemodal} mini colored>
          <Icon name='close' />
        </FABButton>
    </Dialog>
  }
}

export default Modal
