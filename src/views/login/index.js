import React, { Component } from 'react';
import config from '../../config';
import { appbaseService } from '../../service/AppbaseService';

export default class Login extends Component {
	constructor(props) {
		super(props);
		if (appbaseService.userInfo) {
			appbaseService.pushUrl('/apps');
		}
		this.config = config;
	}
	render() {
		const { login } = this.props;
		return (
			<section id="login" className="text-center container">
				<h2>{this.config.login.description}</h2>
				<p>
					Sign in to access your appbase.io apps.<br />
				</p>
				<div className="flex flex-column" id="login-btn-screen">
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
						Don{"'"}t have an account?&nbsp;
						<a href="/signup">Sign up here</a>.
					</p>
				</div>
			</section>
		);
	}
}
