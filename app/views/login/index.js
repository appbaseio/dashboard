import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import { getConfig } from '../../config';
import { appbaseService } from '../../service/AppbaseService';
import LoginModal from '../../shared/LoginModal';

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
				<LoginModal
					showModal={showModal}
					close={close}
					login={login}
				/>
			</section>
		)
	}
}

Login.propTypes = {};

// Default props value
Login.defaultProps = {}
