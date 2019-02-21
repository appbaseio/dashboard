import React from 'react';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Overlay from '../../components/Overlay';
import Container from '../../components/Container';
import Banner from '../../batteries/components/shared/UpgradePlan/Banner';
import RequestLogs from '../../batteries/components/analytics/components/RequestLogs';
import { getAppPlanByName } from '../../batteries/modules/selectors';

const bannerMessagesAnalytics = {
	free: {
		title: 'Request Logs',
		description:
			"View the last 100 request logs to glean insights into your app's behavior. Get a paid plan to view 10x more request logs.",
		buttonText: 'Upgrade Now',
		href: 'billing',
	},
	bootstrap: {
		title: 'Request Logs',
		description:
			"View the last 1,000 request logs to glean insights into your app's behaviors.",
		buttonText: 'Read More',
		href: 'https://docs.appbase.io/concepts/analytics.html#getting-insights-from-analytics',
	},
	growth: {
		title: 'Request Logs',
		description: "View the last 1,000 request logs to glean insights into your app's behavior.",
		buttonText: 'Read More',
		href: 'https://docs.appbase.io/concepts/analytics.html#getting-insights-from-analytics',
	},
};

const RequestLogsWrapper = ({ appName, plan, isPaidUser }) => (
	<React.Fragment>
		{isPaidUser ? (
			<React.Fragment>
				{bannerMessagesAnalytics[plan] && <Banner {...bannerMessagesAnalytics[plan]} />}
				<Container>
					<RequestLogs appName={appName} />
				</Container>
			</React.Fragment>
		) : (
			<React.Fragment>
				<Banner {...bannerMessagesAnalytics.free} />
				<Overlay
					style={{
						maxWidth: '100%',
					}}
					lockSectionStyle={{
						marginTop: '10%',
					}}
					src="/static/images/analytics/LastOperations.png"
					alt="request logs"
				/>
			</React.Fragment>
		)}
	</React.Fragment>
);

RequestLogsWrapper.propTypes = {
	appName: PropTypes.string.isRequired,
	plan: PropTypes.string.isRequired,
	isPaidUser: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
	const appPlan = getAppPlanByName(state);
	return {
		appName: get(state, '$getCurrentApp.name'),
		plan: get(appPlan, 'plan'),
		isPaidUser: get(appPlan, 'isPaid'),
	};
};
export default connect(mapStateToProps)(RequestLogsWrapper);
