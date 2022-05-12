import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Card, Skeleton, Spin } from 'antd';
import ndjsonStream from 'can-ndjson-stream';
import Editor from './Editor';
import { deployClusterStyles } from './styles';
import { ACC_API } from '../../batteries/utils';

const DeployLogs = ({ clusterId, history, showClusterDetails, dataUrl }) => {
	const [deployLogs, setDeployLogs] = useState([]);
	const [timeTaken, setTimeTaken] = useState(0);
	const [isError, setIsError] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [showSpinner, setShowSpinner] = useState(true);

	useEffect(() => {
		getLogs();
	}, [clusterId]);

	const getLogs = async () => {
		const url = `${ACC_API}/v2/_deploy/${clusterId}/deploy_logs`;
		setDeployLogs([]);
		setIsError(false);
		try {
			const response = await fetch(
				`${ACC_API}/v2/_deploy/${clusterId}/deploy_logs`,
				{
					method: 'GET',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/x-ndjson',
					},
				},
			);
			const ndjson = ndjsonStream(response.body);
			const reader = ndjson.getReader();
			loopThroughNdJson(reader, []);
		} catch (err) {
			console.log('Error to fetch logs', err);
			setIsLoading(false);
			setIsError(true);
		}
	};

	const asyncCallWithTimeout = async (asyncPromise, timeLimit) => {
		let timeoutHandle;

		const timeoutPromise = new Promise((_resolve, reject) => {
			timeoutHandle = setTimeout(
				() => reject(new Error('Async call timeout limit reached')),
				timeLimit,
			);
		});

		return Promise.race([asyncPromise, timeoutPromise]).then(result => {
			clearTimeout(timeoutHandle);
			return result;
		});
	};

	const loopThroughNdJson = async (reader, result) => {
		try {
			const newLine = await asyncCallWithTimeout(reader.read(), 60000);

			if (newLine.done && !newLine.value) {
				let endTime;
				if (
					new Date(result[result.length - 1].timestamp).getTime() <
						new Date(result[0].timestamp).getTime() &&
					result[result.length - 2].timestamp
				) {
					endTime = new Date(
						result[result.length - 2].timestamp,
					).getTime();
				} else {
					endTime = new Date(
						result[result.length - 1].timestamp,
					).getTime();
				}

				const time =
					(endTime - new Date(result[0].timestamp).getTime()) /
					(1000 * 60);
				setTimeTaken(Math.round(time * 10) / 10);
				setIsLoading(false);
				setShowSpinner(false);
				reader.releaseLock();
				return;
			}
			setIsLoading(false);
			result = [...result, { ...newLine.value }];
			const time =
				(new Date(result[result.length - 1].timestamp).getTime() -
					new Date(result[0].timestamp).getTime()) /
				(1000 * 60);
			setTimeTaken(Math.round(time * 10) / 10);
			setDeployLogs(result);
		} catch (err) {
			console.log('Error in loop', err);
			getLogs();
			setIsLoading(false);
		}
		loopThroughNdJson(reader, result);
	};

	return (
		<div css={deployClusterStyles}>
			<Card
				title={
					<div className="card-title-container">
						{!isError ? (
							<div>
								Time Taken:{' '}
								{timeTaken
									? Math.round(timeTaken * 10) / 10
									: '- '}
								m
								{showSpinner ? (
									<Spin
										size="small"
										style={{ marginLeft: 10 }}
									/>
								) : null}
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
