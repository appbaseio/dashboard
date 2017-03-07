import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, Link, IndexLink, useRouterHistory, browserHistory } from 'react-router';
import { createHistory, useBasename } from 'history';
import Main from './index';

import AppList from './views/list';
import Dashboard from './views/dashboard';
import Credentials from './views/credentials';
import Team from './views/team';
import Login from './views/login';
import Tutorial from './views/tutorial';
import Browser from './views/browser';
import Billing from './views/billing';
import * as helper from './shared/helper';

const $ = require('jquery');

// const baseName = $('#appbase-dashboard').attr('data-basename') ? $('#appbase-dashboard').attr('data-basename') : './';
// const browserHistory = useRouterHistory(useBasename(createHistory))({
// 	basename: baseName
// });

const Default = () => (<div></div>);

const NotFound = () => {
	browserHistory.push('/');
	return (<div></div>)
};

const appChangesEvent = {
	onLeave: helper.appDashboard.onLeave
};

render((
	<Router history={browserHistory}>
		<Route path="/" component={Main}>
			<IndexRoute component={Default} />
			<Route path="apps" component={AppList} />
			<Route path="login" component={Login} />
			<Route path="tutorial" component={Tutorial} />
			<Route path="billing" component={Billing} />
			<Route path="dashboard/:appId" component={Dashboard} 
				{...appChangesEvent}
				onEnter={params => helper.appDashboard.onEnter(params.params.appId, 'dashboard')}
			/>
			<Route path="browser/:appId" component={Browser} {...appChangesEvent} 
				onEnter={params => helper.appDashboard.onEnter(params.params.appId, 'browser')}
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