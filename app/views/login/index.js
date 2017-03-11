import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { Link, browserHistory } from 'react-router';
import { appbaseService } from '../../service/AppbaseService';

export default class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: false
		};
		if (appbaseService.userInfo) {
			browserHistory.push('/apps');
		}
		this.open = this.open.bind(this);
		this.close = this.close.bind(this);
	}
	close() {
		this.setState({ showModal: false });
	}
	open() {
		this.setState({ showModal: true });
	}
	login(provider) {
		var baseURL = window.location.protocol + "//" + window.location.host + '/';
		var redirectTo = 'https://accapi.appbase.io/login/' + provider + '?next=' + baseURL;
		window.location.href = redirectTo;
	}
	render() {
		const childrenWithProps = React.Children.map(this.props.children,
			(child) => React.cloneElement(child, {
				onClick: this.open
			})
		);
		return (
			<section id="login" className="text-center col-xs-12">
				<h1>
					Login to Appbase or create an account to access your Dashboard.
				</h1>
				<div>
					<button className="ad-theme-btn primary lg-btn" onClick={this.open}>Login</button>
				</div>
				<Modal className="modal-appbase modal-white" id="login_modal" show={this.state.showModal} onHide={() => this.close()}>
					<Modal.Header closeButton>
						<Modal.Title>
							Login with your Github or Google ID.
						</Modal.Title>
						<div className="bootstrap-dialog-close-button">
							<button className="close" onClick={this.close}>×</button>
						</div>
					</Modal.Header>
					<Modal.Body>
						<div>
							<button className="btn Login-button modal-btn" onClick={() => this.login('github')} >Github</button>
							<button className="btn Login-button modal-btn" onClick={() => this.login('google')} >Google</button>
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