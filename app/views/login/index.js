import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { Link, browserHistory } from 'react-router';
import { getConfig } from '../../config';
import { appbaseService } from '../../service/AppbaseService';

export default class Login extends Component {
	constructor(props) {
		super(props);
		if (appbaseService.userInfo) {
			appbaseService.pushUrl('/apps');
		}
		this.config = getConfig();
	}
	render() {
		const { open, close, showModal, login } = this.props;
		return (
			<section id="login" className="text-center container">
				<h2>
					{this.config.login.description}
				</h2>
				<p>
					Login to Appbase or create an account to access your Dashboard.
				</p>
				<div>
					<button className="ad-theme-btn primary lg-btn" onClick={open}>Login</button>
				</div>
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
			</section>
		)
	}
}

Login.propTypes = {};

// Default props value
Login.defaultProps = {}
