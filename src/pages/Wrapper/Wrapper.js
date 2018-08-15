import React, { Fragment } from 'react';
import { Layout } from 'antd';
import { Switch, Route } from 'react-router-dom';

import FullHeader from '../../components/FullHeader';
import ClusterPage from '../ClusterPage';
import HomePage from '../HomePage';

const { Content } = Layout;

const Wrapper = ({ children }) => (
	<Content>
		<FullHeader />

		<Switch>
			<Fragment>
				<Route exact path="/" component={HomePage} />
				<Route exact path="/clusters" component={ClusterPage} />
			</Fragment>
		</Switch>
	</Content>
);

export default Wrapper;
