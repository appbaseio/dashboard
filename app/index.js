import React, { Component } from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router';
import { appbaseService } from './service/AppbaseService';
import { dataOperation } from './service/tutorialService/DataOperation';
import Nav from './shared/Nav';

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
			.then((data) => {
				dataOperation.updateUser(data.userInfo.body);
				this.setState({
					loggedIn: true,
					loading: false,
					userInfo: data.userInfo
				});
				browserHistory.push('/apps');
			}).catch((e) => {
				console.log(e);
				this.setState({
					loggedIn: false,
					loading: false
				});
				browserHistory.push('/login');
			});
	}

	render() {
		let loading = (
			<div className="loadingContainer">
				<div className="loading">
					<i className="fa fa-spinner fa-spin fa-3x fa-fw"></i> <span>Loading</span>
				</div>
			</div>
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
