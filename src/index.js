import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import 'rc-tooltip/assets/bootstrap_white.css';

import { appbaseService } from './service/AppbaseService';
import { dataOperation } from './service/tutorialService/DataOperation';
import Nav from './shared/Nav';
import { intercomService } from './shared/helper';

export default class Main extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
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
			loading: false,
		});
		intercomService.loggingIn(data.userInfo.body);
		localStorage.removeItem('ad-login');
	}

	onGetUserCatch() {
		localStorage.setItem('ad-login', window.location.href);
		browserHistory.push('/login');
		this.setState({
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
