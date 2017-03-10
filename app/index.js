import React, { Component } from 'react';
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router';
import { appbaseService } from './service/AppbaseService';
import { dataOperation } from './service/tutorialService/DataOperation';
import Nav from './shared/Nav';
import { intercomService } from './shared/helper';

require("../dist/css/style.min.css");

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
		var getUser = appbaseService.getUser()
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
		this.redirectToPath();
	}

	onGetUserCatch(e) {
		console.log(e);
		this.setState({
			loggedIn: false,
			loading: false
		});
		browserHistory.push('/login');
	}

	redirectToPath() {
		if(Object.keys(appbaseService.userInfo.body.apps).length === 0) {
			browserHistory.push('/tutorial');
		} else if(window.location.pathname === '/apps' || window.location.pathname === '/') {
			browserHistory.push('/apps');
		}
	}

	render() {
		let loading = (
			<div className="loadingBar"></div>
		);
		let dashboard = (
			<div>
				<Nav />
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
