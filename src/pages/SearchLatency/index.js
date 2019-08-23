import React from 'react';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Overlay from '../../components/Overlay';
import Container from '../../components/Container';
import Banner from '../../batteries/components/shared/UpgradePlan/Banner';
import SearchPerformance from '../../batteries/components/analytics/components/SearchLatency';
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
		title: 'Get search latency analytics with Growth plan',
		description:
			'By upgrading to the Growth plan, you can drill down into the performance of your search.',
		buttonText: 'Upgrade To Growth',
		href: 'billing',
	},
	growth: {
		title: 'Search Latency',
		description:
			'Understand the performance of your search. Learn how to make the most of search latency insights.',
		buttonText: 'Read Docs',
		href: 'https://docs.appbase.io/docs/analytics/Overview/#getting-insights-from-analytics',
	},
};

const SearchLatencyWrapper = ({ plan, isGrowth }) => (
	<React.Fragment>
		{isGrowth ? (
			<React.Fragment>
				{bannerMessagesAnalytics[plan] && <Banner {...bannerMessagesAnalytics[plan]} />}
				<Container>
					<SearchPerformance />
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
					src="/static/images/analytics/SearchLatency.png"
					alt="search latency"
				/>
			</React.Fragment>
		)}
	</React.Fragment>
);

SearchLatencyWrapper.propTypes = {
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
export default connect(mapStateToProps)(SearchLatencyWrapper);
