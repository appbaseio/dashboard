import {
	default as React, Component } from 'react';
var ReactDOM = require('react-dom');
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router';
import { AppsList } from './apps/AppsList';
import { App } from './apps/App';
import { Login } from './others/Login';
import { appbaseService } from './service/AppbaseService';
import { Nav } from './others/Nav';
import { Sidebar } from './others/Sidebar';

class Main extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loggedIn: false,
			userInfo: null,
			loading: true
		};
		this.getUser();
	}
	getUser() {
		var getUser = appbaseService.getUser()
			.then((data) => {
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
				<Sidebar />
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

class NotFound extends Component {
	render() {
		return <h2>Not found</h2>
	}
}

class Default extends Component {
	render() {
		return (<div></div>);
	}
}

ReactDOM.render((
	<Router history={browserHistory}>
		<Route path="/" component={Main}>
			<IndexRoute component={Default} />
			<Route path="apps" component={AppsList} />
			<Route path="login" component={Login} />
			<Route path="app/:appId" component={App} />
		</Route>
	</Router>
), document.getElementById('dashboard'));
