import React from 'react';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Container from '../../components/Container';
import Banner from '../../batteries/components/shared/UpgradePlan/Banner';
import NoResultSearch from '../../batteries/components/analytics/components/NoResultsSearch';
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
			'By upgrading to the Growth plan, you can get more actionable analytics on popular filters, popular results, and track clicks and conversions along with a 30-day retention.',
		buttonText: 'Upgrade To Growth',
		href: 'billing',
	},
	growth: {
		title: 'Learn how to track click analytics',
		description:
			'See our docs on how to track search, filters, click events, conversions and your own custom events.',
		buttonText: 'Read Docs',
		href: 'https://docs.appbase.io',
	},
};

const NoResultSearchWrapper = ({ appName, plan, isPaidUser }) => (
	<React.Fragment>
		{isPaidUser ? (
			<React.Fragment>
				{bannerMessagesAnalytics[plan] && <Banner {...bannerMessagesAnalytics[plan]} />}
				<Container>
					<NoResultSearch appName={appName} plan={plan} />
				</Container>
			</React.Fragment>
		) : (
			<Banner {...bannerMessagesAnalytics.free} />
		)}
	</React.Fragment>
);

NoResultSearchWrapper.propTypes = {
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
export default connect(mapStateToProps)(NoResultSearchWrapper);
