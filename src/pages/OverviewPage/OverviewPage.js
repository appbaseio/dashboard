import React from 'react';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getAppMetrics } from '../../batteries/modules/actions';
import FreeUserOverview from './FreeUserOverview';
import Loader from '../../batteries/components/shared/Loader/Spinner';
import PaidUserOverview from './PaidUserOverview';
import { getAppPlanByName, getAppMetricsByName } from '../../batteries/modules/selectors';

class OverviewPage extends React.Component {
	componentDidMount() {
		const { fetchAppMetrics } = this.props;
		fetchAppMetrics();
	}

	render() {
		const { isFetching, computedMetrics, plan } = this.props;
		if (isFetching) {
			return <Loader />;
		}
		if (
			(plan && plan !== 'free')
			|| (computedMetrics && (computedMetrics.calls || computedMetrics.records))
		) {
			return <PaidUserOverview />;
		}
		return <FreeUserOverview />;
	}
}

OverviewPage.propTypes = {
	plan: PropTypes.string, // eslint-disable-line
	fetchAppMetrics: PropTypes.func.isRequired,
	isFetching: PropTypes.bool.isRequired,
	computedMetrics: PropTypes.object, // eslint-disable-line
};

const mapStateToProps = state => ({
	isFetching: get(state, '$getAppMetrics.isFetching'),
	plan: get(getAppPlanByName(state), 'plan'),
	computedMetrics: get(getAppMetricsByName(state), 'computedMetrics'),
});
const mapDispatchToProps = dispatch => ({
	fetchAppMetrics: (appId, appName) => dispatch(getAppMetrics(appId, appName)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(OverviewPage);
