import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Card, Skeleton } from 'antd';
import Editor from './Editor';
import { getDeployedCluster } from '../ClusterPage/utils';
import { deployClusterStyles } from './styles';

const DeployLogs = ({ clusterId, history, showClusterDetails, dataUrl }) => {
	const [deployLogs, setDeployLogs] = useState([]);
	const [timeTaken, setTimeTaken] = useState(0);
	const [isError, setIsError] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		getLogs();
	}, [clusterId]);

	const getLogs = () => {
		let str = '';
		const newDeployTemplateData = {
			...JSON.parse(localStorage.getItem(dataUrl)),
		};
		getDeployedCluster(clusterId || newDeployTemplateData.clusterId)
			.then(res => res)
			.then(json => {
				setTimeTaken(json.time);
				setDeployLogs(json.data);
				setIsLoading(false);
			})
			.catch(err => {
				if (err?.retryApi) {
					setIsLoading(true);
					return getLogs();
				} else {
					setIsError(true);
					setIsLoading(false);
					return JSON.stringify(err, null, 4) !== '{}'
						? setDeployLogs(JSON.stringify(json, null, 4))
						: setDeployLogs(`Error: Failed to fetch logs`);
				}
			});
	};

	return (
		<div css={deployClusterStyles}>
			<Card
				title={
					<div className="card-title-container">
						{!isError ? (
							<div>
								Time Taken: {Math.round(timeTaken * 10) / 10}s{' '}
							</div>
						) : null}
						{showClusterDetails ? (
							<div
								className="cluster-view-button"
								onClick={() =>
									history.push(`/clusters/${clusterId}`)
								}
							>
								View Cluster Details
							</div>
						) : null}
					</div>
				}
			>
				{isLoading ? <Skeleton active /> : <Editor logs={deployLogs} />}
			</Card>
		</div>
	);
};

DeployLogs.defaultProps = {
	showClusterDetails: true,
};

DeployLogs.propTypes = {
	showClusterDetails: PropTypes.bool,
};

export default withRouter(DeployLogs);
