import React from 'react';
import get from 'lodash/get';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button } from 'antd';

const ClusterExploreRedirect = ({
	urlParams,
	arc,
	clusterName,
	customComponent,
}) => {
	const exploreClusterInNewTab = () => {
		let mainURL = 'http://dash.appbase.io';
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
		const url = `${mainURL}/?url=${arcURL.slice(
			0,
			-1,
		)}&username=${username}&password=${password}&cluster=${clusterName}${arcParams}`;

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
};
export default ClusterExploreRedirect;
