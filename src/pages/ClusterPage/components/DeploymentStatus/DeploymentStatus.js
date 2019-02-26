import React from 'react';
import { Alert } from 'antd';
import { object, func } from 'prop-types';

function getMessage(source) {
	switch (source) {
		case 'arc':
			return "Deployment of appbase.io's GUI for cluster browsing is in progress. Please wait while we spin it up for you.";
		default:
			return `Deployment of ${source} is in progress. Hang tight!`;
	}
}

export default function DeploymentStatus({ data, onProgress }) {
	if (!Object.keys(data).length) return null;
	let { addons, ...deployments } = data; // eslint-disable-line
	if (addons && addons.length) {
		addons.forEach((index) => {
			deployments = {
				...deployments,
				[index.name]: index,
			};
		});
	}
	const deploymentsInProgress = Object.keys(deployments).filter(
		source => deployments[source].status === 'in progress',
	);

	if (deploymentsInProgress.length) {
		// onProgress callback enables the parent to re-fetch the data in some time
		// if any deployment is in progress
		onProgress();
		return (
			<React.Fragment>
				{deploymentsInProgress.map(item => (
					<Alert
						key={item}
						message={getMessage(item)}
						type="info"
						showIcon
						css={{
							marginBottom: 12,
						}}
					/>
				))}
			</React.Fragment>
		);
	}

	return null;
}

DeploymentStatus.propTypes = {
	data: object.isRequired,
	onProgress: func.isRequired,
};
