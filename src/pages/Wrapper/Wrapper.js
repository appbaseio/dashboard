import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Loadable from 'react-loadable';

import Loader from '../../components/Loader';
import AppWrapper from '../AppWrapper';
import NoMatch from '../../NoMatch';

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

const OnboardingPage = Loadable({
	loader: () => import('../OnboardingPage'),
	loading: Loader,
});

const EndPage = Loadable({
	loader: () => import('../OnboardingPage/EndScreen'),
	loading: Loader,
});

const Wrapper = () => (
	<Switch>
		<Route exact path="/" component={HomePage} />
		<Route exact path="/tutorial" component={OnboardingPage} />
		<Route exact path="/tutorial/finish" component={EndPage} />
		<Route exact path="/clusters" component={ClusterPage} />
		<Route exact path="/profile" component={ProfilePage} />
		<Route path="/app/:appName?/:route?" component={AppWrapper} />
		<Route component={NoMatch} />
	</Switch>
);

export default Wrapper;
