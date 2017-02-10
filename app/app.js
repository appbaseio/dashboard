import {
	default as React,
	Component
} from 'react';
var ReactDOM = require('react-dom');
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router';
import { AppsList } from './apps/AppsList';
import { Dashboard } from './apps/Dashboard';
import { AppRoute } from './apps/AppRoute'
import { EsPlugin } from './apps/EsPlugin';
import { Login } from './others/Login';
import { Tutorial } from './tutorial';
import { appbaseService } from './service/AppbaseService';
import { dataOperation } from './service/tutorialService/DataOperation';
import { Nav } from './others/Nav';

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

const Inbox = React.createClass({
	render() {
		return (
			<div>
		<h2>Inbox</h2>
		{this.props.children || "Welcome to your Inbox"}
	  </div>
		)
	}
})

const Message = React.createClass({
	render() {
		return <h3>Message {this.props.params.id}</h3>
	}
})

ReactDOM.render((
	<Router history={browserHistory}>
		<Route path="/" component={Main}>
			<IndexRoute component={Default} />
			<Route path="apps" component={AppsList} />
			<Route path="login" component={Login} />
			<Route path="tutorial" component={Tutorial} />
			<Route path="app/:appId" component={AppRoute} />
		</Route>
	</Router>
), document.getElementById('dashboard'));
