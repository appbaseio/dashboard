import React from 'react';
import { RedoOutlined } from '@ant-design/icons';
import { Alert, Button } from 'antd';
import { object, func, bool, number } from 'prop-types';
import Flex from '../../../../batteries/components/shared/Flex';

function getMessage(source) {
	switch (source) {
		case 'arc':
			return "Deployment of reactivesearch.io's GUI for cluster browsing is in progress. Please wait while we spin it up for you.";
		default:
			return `Deployment of ${source} is in progress. Hang tight!`;
	}
}

export default function DeploymentStatus({
	deploymentDeletionInProgress,
	deploymentsInProgress,
	statusFetchCount,
	isFetchingStatus,
	refetchDeploymentStatus,
}) {
	if (deploymentsInProgress.length || deploymentDeletionInProgress.length) {
		return (
			<Flex
				justifyContent="space-between"
				alignItems="center"
				style={{ margin: '20px 0px 20px 0px' }}
			>
				<div
					style={{
						flex: 1,
						paddingRight: 10,
					}}
				>
					{deploymentsInProgress.map(item => (
						<Alert
							key={item}
							message={getMessage(item)}
							type="info"
							showIcon
						/>
					))}
					{deploymentDeletionInProgress.map(item => (
						<Alert
							key={item}
							message={`Removing ${item}. Hang tight!`}
							type="info"
							showIcon
						/>
					))}
				</div>
				{statusFetchCount >= 5 && (
					<Button
						icon={<RedoOutlined />}
						loading={isFetchingStatus}
						disabled={isFetchingStatus}
						onClick={refetchDeploymentStatus}
						size="large"
					>
						Refetch Deployment Status
					</Button>
				)}
			</Flex>
		);
	}

	return null;
}

DeploymentStatus.propTypes = {
	deploymentsInProgress: object.isRequired,
	deploymentDeletionInProgress: object.isRequired,
	refetchDeploymentStatus: func.isRequired,
	isFetchingStatus: bool.isRequired,
	statusFetchCount: number.isRequired,
};
