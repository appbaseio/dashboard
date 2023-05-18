import { object } from 'prop-types';
import React from 'react';
import Loadable from 'react-loadable';
import { Route, Switch } from 'react-router-dom';
import Loader from '../../components/Loader';

const AppWrapper = Loadable({
	loader: () => import('../AppWrapper'),
	loading: () => <div />,
});

const NoMatch = Loadable({
	loader: () => import('../../NoMatch'),
	loading: () => <div />,
});

const ClusterPage = Loadable({
	loader: () => import('../ClusterPage'),
	loading: Loader,
});

const MarketPlacePage = Loadable({
	loader: () => import('../MarketPlace'),
	loading: Loader,
});

const NewClusterPage = Loadable({
	loader: () => import('../ClusterPage/new'),
	loading: Loader,
});

const NewServerlessSearch = Loadable({
	loader: () => import('../ClusterPage/NewMyServerlessSearch'),
	loading: Loader,
});

const ClusterInfoPage = Loadable({
	loader: () => import('../ClusterPage/info'),
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

const UserDetails = Loadable({
	loader: () => import('../UserDetails'),
	loading: Loader,
});

const NewMyCluster = Loadable({
	loader: () => import('../ClusterPage/NewMyCluster'),
	loading: Loader,
});

const DeployTemplate = Loadable({
	loader: () => import('../DeployTemplate'),
	loading: Loader,
});

function hasFilledDetails(user) {
	if (user && user.data) {
		const {
			data: { usecase, name },
		} = user;
		if (usecase && name && user.data['deployment-timeframe']) {
			return true;
		}
	}
	return false;
}

const Wrapper = ({ user }) =>
	hasFilledDetails(user) ? (
		<Switch>
			<Route exact path="/" component={ClusterPage} />
			<Route exact path="/login" component={ClusterPage} />
			<Route exact path="/signup" component={ClusterPage} />
			<Route exact path="/tutorial" component={OnboardingPage} />
			<Route exact path="/tutorial/finish" component={EndPage} />
			<Route exact path="/marketplace" component={MarketPlacePage} />
			<Route exact path="/apps" component={HomePage} />
			<Route path="/clusters/new/hosted" component={NewClusterPage} />
			<Route path="/clusters/new/my-cluster" component={NewMyCluster} />
			<Route path="/clusters/new" component={NewClusterPage} />
			<Route
				path="/clusters/legacy-new"
				exact
				component={NewClusterPage}
			/>
			<Route path="/clusters/:id" component={ClusterInfoPage} />
			<Route path="/profile" component={ProfilePage} />
			<Route path="/app/:appName?/:route?" component={AppWrapper} />
			<Route exact path="/deploy" component={DeployTemplate} />
			<Route
				path="/new/serverless-search"
				component={NewServerlessSearch}
			/>
			<Route component={NoMatch} />
		</Switch>
	) : (
		<Route component={UserDetails} />
	);

export default Wrapper;

Wrapper.propTypes = {
	user: object,
};
