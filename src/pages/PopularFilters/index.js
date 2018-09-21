import React from 'react';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Container from '../../components/Container';
import PopularFilters from '../../batteries/components/analytics/components/PopularFilters';
import { getAppPlanByName } from '../../batteries/modules/selectors';

const PopularFiltersWrapper = ({ appName, plan }) => (
	<Container>
		<PopularFilters appName={appName} plan={plan} />
	</Container>
);

PopularFiltersWrapper.propTypes = {
	appName: PropTypes.string.isRequired,
	plan: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
	appName: get(state, '$getCurrentApp.name'),
	plan: get(getAppPlanByName(state), 'plan'),
});
export default connect(mapStateToProps)(PopularFiltersWrapper);
