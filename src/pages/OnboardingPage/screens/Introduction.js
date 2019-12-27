import React, { Component } from 'react';
import { notification, List } from 'antd';
import { connect } from 'react-redux';
import Footer from '../components/Footer';

import appbaseHelpers from '../utils/appbaseHelpers';
import { validateAppName, validationsList } from '../../../utils/helper';
import { setCurrentApp } from '../../../batteries/modules/actions';
import Adjectives from '../utils/adjectives';
import Nouns from '../utils/nouns';
import { appendApp } from '../../../actions';

const indexGenerator = length => Math.floor(Math.random() * length);

class Introduction extends Component {
	constructor(props) {
		super(props);

		const appId = appbaseHelpers.getApp();

		this.state = {
			status: '',
			error: '',
			appId,
		};
	}

	componentDidMount() {
		const nounsLength = Nouns.length;
		const adjectivesLength = Adjectives.length;
		const noun = Nouns[indexGenerator(nounsLength)];
		const adjective = Adjectives[indexGenerator(adjectivesLength)];
		const code = Math.random()
			.toString(36)
			.substring(7);

		const generatedAppname = `${adjective}-${noun}-${code}`;
		if (this.input) {
			this.input.value = generatedAppname;
		}
	}

	setError = e => {
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
		const isValidAppName = validateAppName(value);
		let app = {};

		this.setState({
			status: 'Creating your app... Please wait!',
			error: '',
		});

		if (!value || !value.trim()) {
			this.setError('App name cannot be left empty.');
			this.input.focus();
		} else if (!isValidAppName) {
			this.setError(
				'Invalid App name. Please follow the validations rules.',
			);
			notification.error({
				message: 'Invalid App name',
				description: (
					<List
						bordered={false}
						size="small"
						dataSource={validationsList}
						renderItem={item => <List.Item>{item}</List.Item>}
					/>
				),
				duration: 10,
			});
			this.input.focus();
		} else {
			appbaseHelpers
				.createApp(value)
				.then(res => res.json())
				.then(res => {
					if (res.body && res.body.id) {
						app = {
							appName: value,
							id: res.body.id,
							password: res.body.password,
							username: res.body.username,
						};
						appbaseHelpers.updateApp(app);
						this.props.setAppName(value);
					} else {
						this.setError(res.message);
						this.input.focus();
					}
				})
				.then(res => {
					if (app.appName) {
						appbaseHelpers
							.getWritePermissions()
							.then(permission => {
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

						this.props.appendCurrentApp({
							[app.appName]: app.id,
						});
						this.props.updateCurrentApp(app.appName, app.id);
					}
				})
				.catch(e => {
					this.setError(
						'Some error occurred. Please try again with a different app name.',
					);
				});
		}
	};

	renderAppInput = () => (
		<div className="search-field-container small" style={{ marginLeft: 0 }}>
			<div>
				<h3>Pick a unique app name</h3>
				<p>
					Get started by creating an app which will serve as your
					elasticsearch index.
				</p>
			</div>
			<div className="input-wrapper">
				<input
					autoFocus
					className="input"
					ref={ref => {
						this.input = ref;
					}}
					type="text"
				/>
				<a
					className={`button primary ${
						this.state.status ? 'disabled' : ''
					}`}
					onClick={this.createApp}
				>
					Submit
				</a>
			</div>
			{this.state.status && <p>{this.state.status}</p>}
			{this.state.error && (
				<p style={{ color: 'tomato' }}>{this.state.error}</p>
			)}
		</div>
	);

	render() {
		return (
			<div>
				<div className="wrapper">
					<div>
						<img
							src="/static/images/onboarding/Create.svg"
							alt="create app"
						/>
					</div>
					<div className="content">
						<header>
							<h2>Creating your first app with appbase.io</h2>
							<p>
								An app in appbase.io is equivalent to an index
								in Elasticsearch (or like a database in SQL).
							</p>
						</header>
						{this.renderAppInput()}
						<div style={{ width: 600 }}>
							<img
								src="/static/images/onboarding/app.png"
								srcSet="/static/images/onboarding/app.png 351w, /static/images/onboarding/app@2x.png 702w"
								alt="App"
								style={{
									width: 300,
									margin: '40px auto 20px',
									display: 'block',
								}}
							/>
							<p>
								An app holds all the data as JSON documents that
								can be searched with rich queries and
								aggregations.
							</p>
						</div>
					</div>
				</div>
				<Footer nextScreen={this.props.nextScreen} disabled />
			</div>
		);
	}
}

const mapDispatchToProps = dispatch => ({
	updateCurrentApp: (appName, appId) =>
		dispatch(setCurrentApp(appName, appId)),
	appendCurrentApp: payload => dispatch(appendApp(payload)),
});

export default connect(null, mapDispatchToProps)(Introduction);
