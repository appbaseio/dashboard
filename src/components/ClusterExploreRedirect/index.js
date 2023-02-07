import React from 'react';
import get from 'lodash/get';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { connect } from 'react-redux';

const ClusterExploreRedirect = ({
	urlParams,
	arc,
	clusterName,
	customComponent,
	cus_id,
}) => {
	const exploreClusterInNewTab = () => {
		let mainURL = 'https://dash.reactivesearch.io';
		let arcParams = '';

		if (urlParams) {
			const { view, ...otherParams } = urlParams;
			if (view && !get(otherParams, 'insights-id')) {
				const nestedRoute = view.startsWith('/')
					? view.replace('/', '')
					: view;

				mainURL = `${mainURL}/${nestedRoute}`;
			}

			const insightsId = get(otherParams, 'insights-id');
			if (insightsId) {
				arcParams = `&insights-id=${get(
					otherParams,
					'insights-id',
				)}&insights-sidebar=true`;

				mainURL = `${mainURL}/cluster/analytics`;
			}
		}

		const { username, password, url: arcURL } = arc;
		let url = `${mainURL}/?url=${arcURL}&username=${username}&password=${password}&cluster=${clusterName}${arcParams}`;

		if (cus_id) {
			url += `&cus_id=${cus_id}`;
		}
		if (urlParams['auto-navigate'] === true) {
			window.open(url, '_blank');
		}
		return url;
	};

	const renderComponentContent = () => {
		if (customComponent) {
			return typeof customComponent === 'function'
				? customComponent()
				: customComponent;
		}

		return (
			<Button type="primary" size="large">
				Explore Cluster
			</Button>
		);
	};

	return (
		<Link to={{ pathname: exploreClusterInNewTab() }} target="_blank">
			{renderComponentContent()}
		</Link>
	);
};

ClusterExploreRedirect.propTypes = {
	urlParams: PropTypes.object.isRequired,
	arc: PropTypes.object.isRequired,
	clusterName: PropTypes.string.isRequired,
	customComponent: PropTypes.any,
	cus_id: PropTypes.string,
};

const mapStateToProps = state => ({
	cus_id: get(state, 'user.data.cus_id'),
});
export default connect(mapStateToProps)(ClusterExploreRedirect);
