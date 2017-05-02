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

render((
	<Router history={browserHistory}>
		<Route path={getContext()} component={Main}>
			<IndexRoute component={Default} />
			<Route path="apps" component={AppList} />
			<Route path="login" component={Login} />
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
), document.getElementById('appbase-dashboard'));
