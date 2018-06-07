import React, { Component } from 'react';
import Footer from '../components/Footer';

import appbaseHelpers from '../utils/appbaseHelpers';

export default class Introduction extends Component {
	constructor(props) {
		super(props);

		const appId = appbaseHelpers.getApp();

		this.state = {
			status: '',
			error: '',
			appId,
		};
	}

	setError = (e) => {
		if (this.interval) clearInterval(this.interval);
		this.setState(
			{
				status: '',
				error: e,
			},
			() => {
				this.interval = setTimeout(() => {
					this.setState({ error: '' });
				}, 5000);
			},
		);
	};

	createApp = () => {
		const { value } = this.input;
		const pattern = /^[a-zA-Z0-9_+-@$\.]+$/;
		let app = {};

		this.setState({
			status: 'Creating your app... Please Wait!',
			error: '',
		});

		if (!value || !value.trim()) {
			this.setError('App name cannot be left empty.');
			this.input.focus();
		} else if (!pattern.test(value)) {
			this.setError('Please use only alphanumerics (a-z,A-Z,0-9) and any of -._+$@ characters for the app name.');
			this.input.focus();
		} else {
			appbaseHelpers
				.createApp(value)
				.then(res => res.json())
				.then((res) => {
					if (res.body && res.body.id) {
						app = {
							appName: value,
							id: res.body.id,
							password: res.body.password,
							username: res.body.username,
						};
						appbaseHelpers.updateApp(app);
					} else {
						this.setError('Your app name is not unique. Please try with a different app name.');
						this.input.focus();
					}
				})
				.then((res) => {
					if (app.appName) {
						appbaseHelpers.getWritePermissions().then((permission) => {
							app = Object.assign(app, permission);
							appbaseHelpers.updateApp(app);
							this.setState(
								{
									appId: app.id,
								},
								() => {
									this.props.nextScreen();
								},
							);
						});
					}
				})
				.catch((e) => {
					this.setError('Some error occurred. Please try again with a different app name.');
				});
		}
	};

	renderAppInput = () => (
			<div className="search-field-container small" style={{ marginLeft: 0 }}>
				<div>
					<h3>Pick a unique app name</h3>
					<p>
						Get started by creating an app which will serve as your elasticsearch index.
					</p>
				</div>
				<div className="input-wrapper">
					<input
						autoFocus
						className="input"
						ref={(ref) => {
							this.input = ref;
						}}
						type="text"
					/>
					<a
						className={`button primary ${this.state.status ? 'disabled' : ''}`}
						onClick={this.createApp}
					>
						Submit
					</a>
				</div>
				{this.state.status && <p>{this.state.status}</p>}
				{this.state.error && <p style={{ color: 'tomato' }}>{this.state.error}</p>}
			</div>
		);

	render() {
		return (
			<div>
				<div className="wrapper">
					<div>
						<img src="/assets/images/onboarding/Create.svg" alt="create app" />
					</div>
					<div className="content">
						<header>
							<h2>Creating your first app with appbase.io</h2>
							<p>
								An app in appbase.io is equivalent to an index in Elasticsearch (or
								like a database in SQL).
							</p>
						</header>
						{this.renderAppInput()}
						<div style={{ width: 600 }}>
							<img
								src="/assets/images/onboarding/app.png"
								srcSet="/assets/images/onboarding/app.png 351w, /assets/images/onboarding/app@2x.png 702w"
								alt="App"
								style={{
									width: 300,
									margin: '40px auto 20px',
									display: 'block',
								}}
							/>
							<p>An app holds all the data as JSON documents that can be searched with rich queries and aggregations.</p>
						</div>
					</div>
				</div>
				<Footer nextScreen={this.props.nextScreen} disabled />
			</div>
		);
	}
}
