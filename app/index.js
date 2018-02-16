import React, { Component } from 'react';
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router';
import { appbaseService } from './service/AppbaseService';
import { dataOperation } from './service/tutorialService/DataOperation';
import Nav from './shared/Nav';
import { intercomService } from './shared/helper';

require("../dist/css/style.min.css");
import 'rc-tooltip/assets/bootstrap_white.css';

export default class Main extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loggedIn: false,
			userInfo: null,
			loading: true,
			currentApp: null
		};
		this.getUser();
	}

	getUser() {
		appbaseService.getUser()
			.then(this.onGetUserSuccess.bind(this))
			.catch(this.onGetUserCatch.bind(this));
	}

	onGetUserSuccess(data) {
		dataOperation.updateUser(data.userInfo.body);
		this.setState({
			loggedIn: true,
			loading: false,
			userInfo: data.userInfo
		});
		intercomService.loggingIn(data.userInfo.body);
		localStorage.removeItem("ad-login");
		this.redirectToPath();
	}

	onGetUserCatch(e) {
		localStorage.setItem("ad-login", window.location.href);
		appbaseService.pushUrl('/login');
		console.log(e);
		this.setState({
			loggedIn: false,
			loading: false
		});
	}

	redirectToPath() {
		if(Object.keys(appbaseService.userInfo.body.apps).length === 0) {
			appbaseService.pushUrl('/tutorial');
		} else if(window.location.pathname === '/apps' || window.location.pathname === appbaseService.getContextPath() || window.location.pathname+'/' === appbaseService.getContextPath()) {
			appbaseService.pushUrl('/apps');
		}
	}

	render() {
		let loading = (
			<div className="loadingBar"></div>
		);
		let dashboard = (
			<div>
				<Nav open={this.props.route.open} />
				<div id="dashboard-container" className="container-fluid">
					{this.props.children}
				</div>
			</div>
		);

		let visibleComponent = !this.state.loading ? dashboard : loading;
		return (<div className="container-fluid app-container">
			{visibleComponent}
		</div>);
	}
}
