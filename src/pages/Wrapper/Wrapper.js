import React, { Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';
import Loadable from 'react-loadable';

import FullHeader from '../../components/FullHeader';
import Loader from '../../components/Loader';

const ClusterPage = Loadable({
	loader: () => import('../ClusterPage'),
	loading: Loader,
});

const HomePage = Loadable({
	loader: () => import('../HomePage'),
	loading: Loader,
});

const Wrapper = () => (
	<Fragment>
		<FullHeader />

		<Switch>
			<Route exact path="/" component={HomePage} />
			<Route exact path="/clusters" component={ClusterPage} />
		</Switch>
	</Fragment>
);

export default Wrapper;
