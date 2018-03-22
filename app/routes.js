import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, Link, IndexLink, useRouterHistory, browserHistory } from 'react-router';
import { createHistory, useBasename } from 'history';
import Main from './index';
import { appbaseService } from './service/AppbaseService';
import AppList from './views/list';
import Dashboard from './views/dashboard';
import Credentials from './views/credentials';
import Team from './views/team';
import Login from './views/login';
import Tutorial from './views/tutorial';
import Browser from './views/browser';
import Gem from './views/gem';
import Mirage from './views/mirage';
import Billing from './views/billing';
import Importer from './views/importer';
import * as helper from './shared/helper';
import UserInfo from './shared/UserInfo';
import { contextConfig, getConfig } from './config';

const $ = require('jquery');

// const baseName = $('#appbase-dashboard').attr('data-basename') ? $('#appbase-dashboard').attr('data-basename') : './';
// const browserHistory = useRouterHistory(useBasename(createHistory))({
// 	basename: baseName
// });

const Default = () => (<div></div>);

const NotFound = () => {
	helper.appDashboard.onNotFound();
	return (<div></div>)
};

const appChangesEvent = {
	onLeave: helper.appDashboard.onLeave
};

const contextDomSetup = () => {
	const config = getConfig();
	$('#appbase-dashboard, body').addClass(`context-${config.name}`);
	$('link[data-icon="favicon"]').attr({href: config.favicon});
}

const getContext = () => {
	const pathname = window.location.pathname.split('/');
	const context = Object.keys(contextConfig).indexOf(pathname[1]) > -1 ? `/${pathname[1]}` : '/';
	appbaseService.context = context;
	contextDomSetup();
	return context;
}

class MainApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: false
		};
		this.open = this.open.bind(this);
		this.close = this.close.bind(this);
		this.getNexturl = this.getNexturl.bind(this);
		this.login = this.login.bind(this);
	}

	componentDidMount() {
		// to detect if user has logged out in some other tab
		window.onfocus = () => {
			if (localStorage.getItem('reload') === 'true') {
				localStorage.setItem('reload', false);
				window.location.reload()
			}
		}
	}

	close() {
		this.setState({ showModal: false });
	}

	open() {
		this.setState({ showModal: true });
	}

	getNexturl() {
		return localStorage.getItem("ad-login") ? localStorage.getItem("ad-login") : window.location.href;
	}

	login(provider) {
		localStorage.setItem('reload', false);
		var baseURL = window.location.protocol + "//" + window.location.host + '/';
		var redirectTo = appbaseService.address+'login/' + provider + '?next=' + this.getNexturl();
		window.location.href = redirectTo;
	}

	/* React router throws a warning, should update to v4 */
	render() {
		return (
			<Router history={browserHistory}>
				<Route path={getContext()} component={Main} open={this.open}>
					<IndexRoute
						component={
							() =>
								<Login
									showModal={this.state.showModal}
									close={this.close}
									open={this.open}
									login={this.login}
								/>
						}
					/>
					<Route path="profile" component={UserInfo} />
					<Route path="apps" component={AppList} />
					<Route
						path="login"
						component={
							() =>
								<Login
									showModal={this.state.showModal}
									close={this.close}
									open={this.open}
									login={this.login}
								/>
						}
					/>
					<Route path="tutorial" component={Tutorial} />
					<Route path="billing" component={Billing} />
					<Route path="importer" component={Importer} />
					<Route path="dashboard/:appId" component={Dashboard} 
						{...appChangesEvent}
						onEnter={params => helper.appDashboard.onEnter(params.params.appId, 'dashboard')}
					/>
					<Route path="browser/:appId" component={Browser} {...appChangesEvent} 
						onEnter={params => helper.appDashboard.onEnter(params.params.appId, 'browser')}
					/>
					<Route path="mappings/:appId" component={Gem} {...appChangesEvent} 
						onEnter={params => helper.appDashboard.onEnter(params.params.appId, 'mappings')}
					/>
					<Route path="builder/:appId" component={Mirage} {...appChangesEvent} 
						onEnter={params => helper.appDashboard.onEnter(params.params.appId, 'builder')}
					/>
					<Route path="credentials/:appId" component={Credentials} {...appChangesEvent} 
						onEnter={params => helper.appDashboard.onEnter(params.params.appId, 'credentials')}
					/>
					<Route path="team/:appId" component={Team} {...appChangesEvent}
						onEnter={params => helper.appDashboard.onEnter(params.params.appId, 'team')}
					/>
				</Route>
				<Route path="*" component={NotFound} />
			</Router>
		);
	}
}

render(<MainApp />, document.getElementById('appbase-dashboard'));
