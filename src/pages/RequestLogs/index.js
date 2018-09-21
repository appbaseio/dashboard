import React from 'react';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Container from '../../components/Container';
import RequestLogs from '../../batteries/components/analytics/components/RequestLogs';

const RequestLogsWrapper = ({ appName, match }) => {
	const activeTab = get(match, 'params.tab');
	return (
		<Container>
			<RequestLogs
				appName={appName}
				tab={activeTab}
				onTabChange={(tab) => {
					window.history.pushState(
						null,
						null,
						`${window.location.origin}/app/${appName}/request-logs/${tab}`,
					);
				}}
			/>
		</Container>
	);
};

RequestLogsWrapper.propTypes = {
	appName: PropTypes.string.isRequired,
	match: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
	appName: get(state, '$getCurrentApp.name'),
});
export default connect(mapStateToProps)(RequestLogsWrapper);
