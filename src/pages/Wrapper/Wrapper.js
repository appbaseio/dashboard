import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Loadable from 'react-loadable';

import Loader from '../../components/Loader';
import AppWrapper from '../AppWrapper';

const ClusterPage = Loadable({
	loader: () => import('../ClusterPage'),
	loading: Loader,
});
const ProfilePage = Loadable({
	loader: () => import('../ProfilePage'),
	loading: Loader,
});

const HomePage = Loadable({
	loader: () => import('../HomePage'),
	loading: Loader,
});

const Wrapper = () => (
	<Switch>
		<Route exact path="/" component={HomePage} />
		<Route exact path="/clusters" component={ClusterPage} />
		<Route exact path="/profile" component={ProfilePage} />
		<Route path="/app/:appName?/:route?" component={AppWrapper} />
	</Switch>
);

export default Wrapper;
