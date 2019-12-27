import React from 'react';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { css } from 'emotion';
import Overlay from '../../components/Overlay';
import Banner from '../../batteries/components/shared/UpgradePlan/Banner';
import { getAppPlanByName } from '../../batteries/modules/selectors';
import SearchTemplates from './SearchTemplates';

const bannerMessagesAnalytics = {
	title: 'Secure your app with search templates',
	description:
		'Get a paid plan to create stored search templates. Prevent script injections and secure your search usage.',
	buttonText: 'Upgrade Now',
	href: 'billing',
};

const TemplatesView = ({ isPaidUser }) => (
	<React.Fragment>
		{isPaidUser ? (
			<SearchTemplates />
		) : (
			<React.Fragment>
				<Banner {...bannerMessagesAnalytics} />
				<Overlay
					style={{
						maxWidth: '70%',
					}}
					lockSectionStyle={{
						marginTop: '22%',
					}}
					// lockSectionClassName={css`
					// 	display: none;
					// 	.button {
					// 		display: none;
					// 	}
					// `}
					src="/static/images/templates_banner.png"
					alt="analytics"
				/>
			</React.Fragment>
		)}
	</React.Fragment>
);
TemplatesView.propTypes = {
	isPaidUser: PropTypes.bool.isRequired,
	plan: PropTypes.string.isRequired,
};

const mapStateToProps = state => {
	const appPlan = getAppPlanByName(state);
	return {
		plan: get(appPlan, 'plan'),
		isPaidUser: get(appPlan, 'isPaid'),
	};
};
export default connect(mapStateToProps)(TemplatesView);
