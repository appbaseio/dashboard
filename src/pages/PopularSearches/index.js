import React from 'react';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Overlay from '../../components/Overlay';
import Container from '../../components/Container';
import Banner from '../../batteries/components/shared/UpgradePlan/Banner';
import PopularSearches from '../../batteries/components/analytics/components/PopularSearches';
import { getAppPlanByName } from '../../batteries/modules/selectors';

const bannerMessagesAnalytics = {
	free: {
		title: 'Unlock the ROI impact of your search',
		description:
			'Get a paid plan to see actionable analytics on search volume, popular searches, no results, track clicks and conversions.',
		buttonText: 'Upgrade Now',
		href: 'billing',
	},
	bootstrap: {
		title: 'Get richer analytics on clicks and conversions',
		description:
			'By upgrading to the Growth plan, you can track clicks and conversions, get a 30-day retention on analytics along with being able to view actionable analytics on popular filters, popular results, search latency and geo distribution.',
		buttonText: 'Upgrade To Growth',
		href: 'billing',
	},
	growth: {
		title: 'Learn how to track click analytics',
		description:
			'See our docs on how to track search, filters, click events, conversions and add your own custom events.',
		buttonText: 'Read Docs',
		href: 'https://docs.appbase.io/concepts/analytics.html#getting-insights-from-analytics',
	},
};

const PopularSearchesWrapper = ({ appName, plan, isPaidUser }) => (
	<React.Fragment>
		{isPaidUser ? (
			<React.Fragment>
				{bannerMessagesAnalytics[plan] && <Banner {...bannerMessagesAnalytics[plan]} />}
				<Container>
					<PopularSearches displayReplaySearch appName={appName} plan={plan} />
				</Container>
			</React.Fragment>
		) : (
			<React.Fragment>
				<Banner {...bannerMessagesAnalytics.free} />
				<Overlay
					src="/static/images/analytics/PopularSearches.png"
					alt="popular searches"
				/>
			</React.Fragment>
		)}
	</React.Fragment>
);

PopularSearchesWrapper.propTypes = {
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
export default connect(mapStateToProps)(PopularSearchesWrapper);
