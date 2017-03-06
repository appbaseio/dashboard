import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router';
import Main from './index';

import AppList from './list';
import Detail from './detail'
import Login from './login';
import Tutorial from './tutorial';
import * as helper from './shared/helper';

const Default = () => (<div></div>);

const NotFound = () => {
	browserHistory.push('/dashboard/');
	return (<div></div>)
};

render((
	<Router history={browserHistory}>
		<Route path="/dashboard/" component={Main}>
			<IndexRoute component={Default} />
			<Route path="apps" component={AppList} />
			<Route path="login" component={Login} />
			<Route path="tutorial" component={Tutorial} />
			<Route path="app/:appId" component={Detail} 
				onEnter={params => helper.appDashboard.onEnter(params.params.appId)}
				onLeave={helper.appDashboard.onLeave} 
			/>
		</Route>
		<Route path="*" component={NotFound} />
	</Router>
), document.getElementById('appbase-dashboard'));