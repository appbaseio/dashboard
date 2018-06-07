import React, { Component } from 'react';
import config from '../../config';
import { appbaseService } from '../../service/AppbaseService';

export default class Signup extends Component {
	constructor(props) {
		super(props);
		if (appbaseService.userInfo) {
			appbaseService.pushUrl('/apps');
		}
		this.config = config;
		this.handleChange = this.handleChange.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
		this.state = {
			tos: false,
			optIn: false,
		};
	}

	handleChange({ target: { checked, name } }) {
		this.setState({ [name]: checked });
	}

	handleLogin(mode) {
		const { optIn } = this.state;
		if (optIn) {
			localStorage.setItem('optIn', true);
		}
		this.props.login(mode);
	}

	render() {
		const { tos, optIn } = this.state;
		return (
			<section id="login" className="text-center container">
				<h2>{this.config.login.description}</h2>
				<h3>Sign up to create an appbase.io app.</h3>
				<p style={{ textAlign: 'left', maxWidth: 650, margin: '20px auto' }}>
					<label
						style={{ padding: 0, marginBottom: 5 }}
						htmlFor="tos"
						className="ad-filter-shareapps checkbox-inline"
					>
						<input
							style={{ width: 16, height: 16 }}
							type="checkbox"
							id="tos"
							name="tos"
							checked={tos}
							onChange={this.handleChange}
						/>
						By creating an account, you agree to our{' '}
						<a href="https://appbase.io/tos" target="_blank">
							Terms of Service
						</a>{' '}
						and{' '}
						<a href="https://appbase.io/privacy" target="_blank">
							Privacy Policy
						</a>.
					</label>
					<label
						style={{ padding: 0, margin: 0 }}
						htmlFor="optIn"
						className="ad-filter-shareapps checkbox-inline"
					>
						<input
							style={{ width: 16, height: 16 }}
							type="checkbox"
							id="optIn"
							name="optIn"
							checked={optIn}
							onChange={this.handleChange}
						/>
						Yes, I would like to receive a monthly e-mail on Appbase products, use-cases
						and promotions via e-mail.
					</label>
				</p>
				<div className="flex flex-column" id="login-btn-screen">
					<button
						className="btn Login-button modal-btn github-btn"
						onClick={() => this.handleLogin('github')}
						disabled={!tos}
					>
						<i className="fab fa-github" />Sign up with GitHub
					</button>
					<button
						className="btn Login-button modal-btn google-btn"
						onClick={() => this.handleLogin('google')}
						disabled={!tos}
					>
						<i className="fab fa-google-plus-g" />Sign up with Google
					</button>
				</div>
				<div className="mt25">
					Already have an account? <a href="/login">Login here</a>.
					<p className="no-margin">
						Having issues signing up? Write to us&nbsp;
						<a
							className="contact-link"
							href="mailto:info@appbase.io?subject=Login+issues"
							target="_blank"
						>
							here
						</a>.
					</p>
				</div>
			</section>
		);
	}
}
