import React from 'react';
import { Tag, Tooltip } from 'antd';
import PropTypes from 'prop-types';

import get from 'lodash/get';

import StripeCheckout from '../StripeCheckout';
import {
	createSubscription,
	PLAN_LABEL,
	EFFECTIVE_PRICE_BY_PLANS,
} from '../../pages/ClusterPage/utils';

class TrialButton extends React.Component {
	state = {
		isStripeCheckoutOpen: false,
	};

	handleStripeModal = () => {
		this.setState(currentState => ({
			isStripeCheckoutOpen: !currentState.isStripeCheckoutOpen,
		}));
	};

	handleToken = async (clusterId, token) => {
		try {
			this.setState({
				isStripeCheckoutOpen: false,
			});
			await createSubscription(clusterId, token);
			window.location.reload();
		} catch (e) {
			console.log(e);
		}
	};

	render() {
		const {
			cluster,
			clusterDaysLeft,
			daysLeft,
			isCluster,
			trialMessage,
			clusters,
		} = this.props;

		const clusterTrialMessage =
			'You are currently on a free 14-day trial.You can upgrade to a paid plan now to continue accessing the cluster.';

		const tooltipTitle = isCluster ? clusterTrialMessage : trialMessage;

		const daysLeftValue = isCluster ? clusterDaysLeft : daysLeft;

		if (cluster) {
			return (
				<Tooltip title={tooltipTitle}>
					<Tag color="red">
						{daysLeftValue > 0
							? `Trial expires in ${daysLeftValue} ${
									daysLeftValue > 1 ? 'days' : 'day'
							  }. Upgrade Now`
							: 'Trial has expired. Upgrade Now'}
					</Tag>
				</Tooltip>
			);
		}
		let unPaidClusters = [];
		if (clusters.length) {
			unPaidClusters = clusters.filter(i => i.subscription_id === '');
		}
		if (isCluster && unPaidClusters.length > 0) {
			return (
				<>
					{this.state.isStripeCheckoutOpen && (
						<StripeCheckout
							visible={this.state.isStripeCheckoutOpen}
							plan={
								PLAN_LABEL[
									get(unPaidClusters, `[0].pricing_plan`, 0)
								]
							}
							price={EFFECTIVE_PRICE_BY_PLANS[
								get(unPaidClusters, `[0].pricing_plan`, 0)
							].toString()}
							onCancel={this.handleStripeModal}
							onSubmit={token =>
								this.handleToken(
									get(unPaidClusters, `[0].id`, 0),
									token,
								)
							}
						/>
					)}
					<Tooltip title={tooltipTitle}>
						<Tag
							color="red"
							onClick={this.handleStripeModal}
							style={{ cursor: 'pointer' }}
						>
							{daysLeftValue > 0
								? `Trial expires in ${daysLeftValue} ${
										daysLeftValue > 1 ? 'days' : 'day'
								  }. Upgrade Now`
								: 'Trial has expired. Upgrade Now'}
						</Tag>
					</Tooltip>
				</>
			);
		}

		return (
			<>
				<Tooltip title={tooltipTitle}>
					<Tag color="red">
						{daysLeftValue > 0
							? `Trial expires in ${daysLeftValue} ${
									daysLeftValue > 1 ? 'days' : 'day'
							  }`
							: 'Trial has expired'}
					</Tag>
				</Tooltip>
			</>
		);
	}
}

TrialButton.defaultProps = {
	cluster: '',
	isCluster: false,
	trialMessage:
		'You are currently on a trial which unlocks all the Growth plan features. You can upgrade to a paid plan anytime till the trial expires. After that, you will be downgraded to the free plan.', // Apps Message
};

TrialButton.propTypes = {
	cluster: PropTypes.string,
	isCluster: PropTypes.bool,
	trialMessage: PropTypes.string,
	daysLeft: PropTypes.number.isRequired,
	clusterDaysLeft: PropTypes.number.isRequired,
	clusters: PropTypes.array,
};

export default TrialButton;
