import React from 'react';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Analytics from '../../batteries/components/analytics';

const AnalyticsView = ({ appName, match }) => {
	const tab = get(match, 'params.tab');
	const subTab = get(match, 'params.subTab');
	return (
		<Analytics
			chartWidth={window.innerWidth - 400}
			appName={appName}
			tab={tab}
			subTab={subTab}
		/>
	);
};
AnalyticsView.propTypes = {
	appName: PropTypes.string.isRequired,
	match: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
	appName: get(state, '$getCurrentApp.name'),
});
export default connect(mapStateToProps)(AnalyticsView);
