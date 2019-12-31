import React from 'react';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Overlay from '../../components/Overlay';
import Container from '../../components/Container';
import Banner from '../../batteries/components/shared/UpgradePlan/Banner';

import GeoDistributionPage from '../../batteries/components/analytics/components/GeoDistribution';
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
		title: 'Get geo distribution analytics with Growth plan',
		description:
			'By upgrading to the Growth plan, you can visualize where your search traffic is coming from.',
		buttonText: 'Upgrade To Growth',
		href: 'billing',
	},
	growth: {
		title: 'Geo Distribution',
		description:
			'Understand where you search traffic is coming from. Learn how to make the most of geo distribution insights.',
		buttonText: 'Read Docs',
		href:
			'https://docs.appbase.io/docs/analytics/Overview/#getting-insights-from-analytics',
	},
};

const PopularResultsWrapper = ({ plan, isGrowth }) => (
	<React.Fragment>
		{isGrowth ? (
			<React.Fragment>
				{bannerMessagesAnalytics[plan] && (
					<Banner {...bannerMessagesAnalytics[plan]} />
				)}
				<Container>
					<GeoDistributionPage />
				</Container>
			</React.Fragment>
		) : (
			<React.Fragment>
				<Banner {...bannerMessagesAnalytics[plan]} />
				<Overlay
					style={{
						maxWidth: '70%',
					}}
					src="/static/images/analytics/GeoDistribution.png"
					alt="analytics"
				/>
			</React.Fragment>
		)}
	</React.Fragment>
);

PopularResultsWrapper.propTypes = {
	plan: PropTypes.string.isRequired,
	isGrowth: PropTypes.bool.isRequired,
};

const mapStateToProps = state => {
	const appPlan = getAppPlanByName(state);
	return {
		plan: get(appPlan, 'plan', 'free'),
		isGrowth: get(appPlan, 'isGrowth'),
	};
};
export default connect(mapStateToProps)(PopularResultsWrapper);
