import React from 'react';
import { Modal } from 'react-bootstrap';

const LoginModal = ({ showModal, close, login }) => (
    <Modal className="modal-appbase modal-white" id="login_modal" show={showModal} onHide={close}>
        <Modal.Header closeButton>
            <Modal.Title>
                Login with your Github or Google ID.
            </Modal.Title>
            <div className="bootstrap-dialog-close-button">
                <button className="close" onClick={close}>×</button>
            </div>
        </Modal.Header>
        <Modal.Body>
            <div>
                <button className="btn Login-button modal-btn" onClick={() => login('github')} >Github</button>
                <button className="btn Login-button modal-btn" onClick={() => login('google')} >Google</button>
            </div>
            <div className="mt25">
                <p className="no-margin">
                    Having issues logging in? Write to us&nbsp;
                    <a className="contact-link" href="mailto:info@appbase.io?subject=Login+issues" target="_blank">here</a>.
                </p>
            </div>
        </Modal.Body>
    </Modal>
);

export default LoginModal;
