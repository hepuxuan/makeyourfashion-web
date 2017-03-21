import React from 'react'
import css from './main.css'
import {Dialog, FABButton, Icon} from 'react-mdl'

const Modal = ({onCloseModal, open, children}) => <Dialog className={css.modal} onCancel={onCloseModal} open={open}>
		{children}
		<FABButton onClick={onCloseModal} className={css.closemodal} mini colored>
	    <Icon name='close' />
		</FABButton>
</Dialog>

export default Modal
