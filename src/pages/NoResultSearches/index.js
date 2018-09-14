import React from 'react';

import get from 'lodash/get';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NoResultSearch from '../../batteries/components/analytics/components/NoResultsSearch';

const NoResultSearchWrapper = ({ appName, plan }) => (
	<NoResultSearch appName={appName} plan={plan} />
);

NoResultSearchWrapper.propTypes = {
	appName: PropTypes.string.isRequired,
	plan: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
	appName: get(state, '$getCurrentApp.name'),
	plan: get(state, '$getAppPlan.plan'),
});
export default connect(mapStateToProps)(NoResultSearchWrapper);
