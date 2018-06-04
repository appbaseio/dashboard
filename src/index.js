import React, { Component } from 'react';
import { appbaseService } from './service/AppbaseService';
import { dataOperation } from './service/tutorialService/DataOperation';
import Nav from './shared/Nav';
import { intercomService } from './shared/helper';

import 'rc-tooltip/assets/bootstrap_white.css';
// require('../dist/css/style.min.css');

export default class Main extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loggedIn: false,
			userInfo: null,
			loading: true,
			currentApp: null,
		};
		this.getUser();
	}

	getUser() {
		appbaseService
			.getUser()
			.then(this.onGetUserSuccess.bind(this))
			.catch(this.onGetUserCatch.bind(this));
	}

	onGetUserSuccess(data) {
		dataOperation.updateUser(data.userInfo.body);
		this.setState({
			loggedIn: true,
			loading: false,
			userInfo: data.userInfo,
		});
		intercomService.loggingIn(data.userInfo.body);
		localStorage.removeItem('ad-login');
	}

	onGetUserCatch(e) {
		localStorage.setItem('ad-login', window.location.href);
		appbaseService.pushUrl('/login');
		console.log(e);
		this.setState({
			loggedIn: false,
			loading: false,
		});
	}

	redirectToPath() {
		if (Object.keys(appbaseService.userInfo.body.apps).length === 0) {
			appbaseService.pushUrl('/onboarding');
		} else if (
			window.location.pathname === '/apps' ||
			window.location.pathname === appbaseService.getContextPath() ||
			`${window.location.pathname}/` === appbaseService.getContextPath()
		) {
			appbaseService.pushUrl('/apps');
		}
	}

	render() {
		const loading = <div className="loadingBar" />;
		const dashboard = (
			<div>
				<Nav open={this.props.route.open} />
				<div id="dashboard-container" className="container-fluid">
					{this.props.children}
				</div>
			</div>
		);

		const visibleComponent = !this.state.loading ? dashboard : loading;
		return <div className="container-fluid app-container">{visibleComponent}</div>;
	}
}
