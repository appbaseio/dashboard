import React from 'react';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PopularResults from '../../batteries/components/analytics/components/PopularResults';
import { getAppPlanByName } from '../../batteries/modules/selectors';

const PopularResultsWrapper = ({ appName, plan }) => (
	<PopularResults appName={appName} plan={plan} />
);

PopularResultsWrapper.propTypes = {
	appName: PropTypes.string.isRequired,
	plan: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
	appName: get(state, '$getCurrentApp.name'),
	plan: get(getAppPlanByName(state), 'plan'),
});
export default connect(mapStateToProps)(PopularResultsWrapper);
