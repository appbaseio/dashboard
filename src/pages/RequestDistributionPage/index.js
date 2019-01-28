import React from 'react';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Overlay from '../../components/Overlay';
import Container from '../../components/Container';
import Banner from '../../batteries/components/shared/UpgradePlan/Banner';
import RequestDistribution from '../../batteries/components/analytics/components/RequestDistribution';
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
		title: 'Get request distribution analytics with Growth plan',
		description:
			'By upgrading to the Growth plan, you can visualize the status of your requests.',
		buttonText: 'Upgrade To Growth',
		href: 'billing',
	},
	growth: {
		title: 'Request Distribution',
		description:
			'Understand the status of your requests, Learn how to make the most of request distribution insights.',
		buttonText: 'Read Docs',
		href: 'https://docs.appbase.io',
	},
};

const RequestDistributionWrapper = ({ plan, isGrowth }) => (
	<React.Fragment>
		{isGrowth ? (
			<React.Fragment>
				{bannerMessagesAnalytics[plan] && <Banner {...bannerMessagesAnalytics[plan]} />}
				<Container>
					<RequestDistribution />
				</Container>
			</React.Fragment>
		) : (
			<React.Fragment>
				<Banner {...bannerMessagesAnalytics[plan]} />

				<Overlay
					style={{
						maxWidth: '100%',
					}}
					lockSectionStyle={{
						marginTop: '15%',
					}}
					src="/static/images/analytics/RequestDistribution.png"
					alt="request distribution"
				/>
			</React.Fragment>
		)}
	</React.Fragment>
);

RequestDistributionWrapper.propTypes = {
	plan: PropTypes.string.isRequired,
	isGrowth: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
	const appPlan = getAppPlanByName(state);
	return {
		plan: get(appPlan, 'plan', 'free'),
		isGrowth: get(appPlan, 'isGrowth'),
	};
};
export default connect(mapStateToProps)(RequestDistributionWrapper);
