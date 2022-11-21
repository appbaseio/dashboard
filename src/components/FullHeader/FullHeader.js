import React from 'react';
import { Layout, Menu, Tag, Icon, Row } from 'antd';
import { Link } from 'react-router-dom';
import { object, string, bool, number, array } from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { css } from 'react-emotion';
import ReactivesearchLogo from '../Logo/ReactivesearchLogo';
import UserMenu from '../AppHeader/UserMenu';
import MenuSlider from './MenuSlider';
import headerStyles from './styles';
import { media } from '../../utils/media';
import { getUserPlan } from '../../batteries/modules/actions/account';
import TrialButton from './TrialButton';

const { Header } = Layout;

const link = css`
	margin-right: 30px;
	color: rgba(0, 0, 0, 0.65);
	i {
		margin-right: 4px;
	}
	${media.medium(css`
		display: none;
	`)};
`;

const FullHeader = ({
	user,
	apps,
	cluster,
	isUsingTrial,
	isUsingClusterTrial,
	daysLeft,
	clusterDaysLeft,
	currentApp,
	isCluster,
	trialMessage,
	clusters,
	clusterPlan,
}) => (
	<Header className={headerStyles}>
		<div className="row">
			<Link to="/">
				<ReactivesearchLogo width={170} />
			</Link>
			<Menu
				mode="horizontal"
				className="options"
				defaultSelectedKeys={[window.location.pathname]}
			>
				<Menu.Item key="/">
					<Link to="/">Clusters</Link>
				</Menu.Item>

				{cluster ? (
					<Menu.Item key={`/clusters/${cluster}`}>
						<Link to={`/clusters/${cluster}`}>
							<Icon type="cluster" /> {cluster}
						</Link>
					</Menu.Item>
				) : null}

				{apps && Boolean(Object.keys(apps).length) && (
					<Menu.Item key="/apps">
						<Link to="/apps">Apps</Link>
					</Menu.Item>
				)}

				<Menu.Item key="/marketplace">
					<Link to="/marketplace">
						MarketPlace <Tag>New</Tag>
					</Link>
				</Menu.Item>
			</Menu>
		</div>
		<Row justify="space-between" align="middle">
			{(isCluster ? isUsingClusterTrial : isUsingTrial) && (
				<TrialButton
					showButton={isCluster}
					currentApp={currentApp}
					cluster={cluster}
					clusters={clusters}
					daysLeft={daysLeft}
					clusterPlan={clusterPlan}
					clusterDaysLeft={clusterDaysLeft}
					isCluster={isCluster}
					user={user}
					trialMessage={trialMessage}
				/>
			)}
			<a
				href="https://docs.appbase.io/"
				className={link}
				target="_blank"
				rel="noopener noreferrer"
			>
				<Icon type="rocket" /> Docs
			</a>
			<UserMenu user={user} />
		</Row>
		<MenuSlider
			isHomepage
			defaultSelectedKeys={[window.location.pathname]}
			isUsingTrial={isUsingTrial}
			daysLeft={daysLeft}
		/>
	</Header>
);

FullHeader.defaultProps = {
	daysLeft: 0,
	clusterDaysLeft: 0,
	cluster: '',
	isCluster: false,
	trialMessage:
		'You are currently on a trial which unlocks all the Growth monthly features. You can upgrade to a paid plan anytime till the trial expires. Post trial expiration, you will be subscribed to the free plan.', // Apps Message
};

FullHeader.propTypes = {
	user: object.isRequired,
	apps: object,
	cluster: string,
	clusters: array,
	currentApp: string.isRequired,
	isCluster: bool,
	trialMessage: string,
	isUsingTrial: bool.isRequired,
	isUsingClusterTrial: bool.isRequired,
	daysLeft: number,
	clusterDaysLeft: number,
	clusterPlan: string,
};

const mapStateToProps = state => {
	let currentApp = state.apps ? Object.keys(state.apps)[0] : '';
	const storedApp = get(state, '$getCurrentApp.name');
	if (storedApp) {
		currentApp = storedApp;
	}

	return {
		user: get(state, 'user.data'),
		apps: get(state, 'appsOwners.data'),
		isUsingTrial: get(state, '$getUserPlan.trial') || false,
		isUsingClusterTrial: get(state, '$getUserPlan.cluster_trial') || false,
		daysLeft: get(state, '$getUserPlan.daysLeft', 0),
		clusterDaysLeft: get(state, '$getUserPlan.clusterDaysLeft', 0),
		currentApp,
	};
};

const mapDispatchToProps = dispatch => ({
	getPlan: () => dispatch(() => getUserPlan()),
});

export default connect(mapStateToProps, mapDispatchToProps)(FullHeader);
