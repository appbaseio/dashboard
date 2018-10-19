import React from 'react';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FreeUserOverview from './FreeUserOverview';
import PaidUserOverview from './PaidUserOverview';
import { getAppPlanByName } from '../../batteries/modules/selectors';

const OverviewPage = ({ plan }) => {
	throw new Error();
	if (!plan || plan === 'free') {
		return <FreeUserOverview />;
	}
	return <PaidUserOverview />;
};

OverviewPage.propTypes = {
	plan: PropTypes.string, // eslint-disable-line
};

const mapStateToProps = state => ({
	plan: get(getAppPlanByName(state), 'plan'),
});

export default connect(mapStateToProps)(OverviewPage);
