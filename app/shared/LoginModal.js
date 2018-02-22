import React from 'react';
import { Modal } from 'react-bootstrap';

const LoginModal = ({ showModal, close, login }) => (
    <Modal className="modal-appbase modal-white" id="login_modal" show={showModal} onHide={close}>
        <Modal.Header closeButton>
            <Modal.Title>
                Login with your Github or Google ID.
            </Modal.Title>
            <div className="bootstrap-dialog-close-button">
                <button className="close" onClick={close}>&times;</button>
            </div>
        </Modal.Header>
        <Modal.Body>
            <div className="flex flex-column">
                <button
                    className="btn Login-button modal-btn github-btn"
                    onClick={() => login('github')}
                >
                    <i className="fab fa-github" />Sign in with GitHub
                </button>
                <button
                    className="btn Login-button modal-btn google-btn"
                    onClick={() => login('google')}
                >
                    <i className="fab fa-google-plus-g" />Sign in with Google
                </button>
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
