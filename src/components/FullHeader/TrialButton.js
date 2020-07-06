import React from 'react';
import { Button, Tag, Tooltip } from 'antd';
import { object, string, bool } from 'prop-types';
import { Link } from 'react-router-dom';
import Stripe from 'react-stripe-checkout';
import { css } from 'react-emotion';
import get from 'lodash/get';

import { media } from '../../utils/media';
import { createSubscription, STRIPE_KEY } from '../../pages/ClusterPage/utils';

const trialText = css`
	line-height: 2em;
	font-size: 0.9em;
`;

const trialBtn = css`
	${media.medium(css`
		display: none;
	`)};
`;

const trialLink = css`
	margin-right: 30px;
	${media.xlarge(css`
		display: none;
	`)};
`;

const handleToken = async (clusterId, token) => {
	try {
		await createSubscription(clusterId, token);
		this.init();
	} catch (e) {
		console.log(e);
	}
};

const buttonWithMessage = ({ daysLeft, redirectURL, trialMessage }) => (
	<Link className={trialLink} to={redirectURL}>
		<Tooltip title={trialMessage}>
			<Button css={trialBtn} type="danger">
				<span css={trialText}>
					{daysLeft > 0
						? `Trial expires in ${daysLeft} ${
								daysLeft > 1 ? 'days' : 'day'
						  }. Upgrade Now`
						: 'Trial has expired. Upgrade Now'}
				</span>
			</Button>
		</Tooltip>
	</Link>
);

const TrialButton = props => {
	const {
		cluster,
		clusterDaysLeft,
		daysLeft,
		isCluster,
		currentApp,
		trialMessage,
		user: { apps },
		clusters,
		clusterPlan,
	} = props; // prettier-ignore

	// prettier-ignore
	const clusterTrialMessage =	'You are currently on a free 14-day trial.You can upgrade to a paid plan now to continue accessing the cluster.';

	const tooltipTitle = isCluster ? clusterTrialMessage : trialMessage;

	const daysLeftValue = isCluster ? clusterDaysLeft : daysLeft;
	const appNames = apps ? Object.keys(apps) : [];
	const redirectApp =
		currentApp && appNames.includes(currentApp) ? currentApp : '';

	if (cluster) {
		return (
			<Stripe
				name="Appbase.io Clusters"
				amount={(clusterPlan || 0) * 100}
				token={token => handleToken(clusters, token)}
				disabled={false}
				stripeKey={STRIPE_KEY}
			>
				<Tooltip title={tooltipTitle}>
					<Tag color="red">
						{daysLeftValue > 0
							? `Trial expires in ${daysLeftValue} ${
									daysLeftValue > 1 ? 'days' : 'day'
							  }. Upgrade Now`
							: 'Trial has expired. Upgrade Now'}
					</Tag>
				</Tooltip>
			</Stripe>
		);
	}

	if (isCluster && clusters && clusters.length > 0) {
		return (
			<Stripe
				name="Appbase.io Clusters"
				amount={get(clusters, `[0].plan_rate`, 0) * 100}
				token={token => handleToken(get(clusters, `[0].id`, 0), token)}
				disabled={false}
				stripeKey={STRIPE_KEY}
			>
				<Tooltip title={tooltipTitle}>
					<Tag color="red">
						{daysLeftValue > 0
							? `Trial expires in ${daysLeftValue} ${
									daysLeftValue > 1 ? 'days' : 'day'
							  }. Upgrade Now`
							: 'Trial has expired. Upgrade Now'}
					</Tag>
				</Tooltip>
			</Stripe>
		);
	}

	if (redirectApp) {
		return buttonWithMessage({
			daysLeft: daysLeftValue,
			trialMessage: tooltipTitle,
			redirectURL: `/app/${redirectApp}/billing`,
		});
	}
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
};

TrialButton.defaultProps = {
	cluster: '',
	isCluster: false,
	trialMessage:
		'You are currently on a trial which unlocks all the Growth plan features. You can upgrade to a paid plan anytime till the trial expires. After that, you will be downgraded to the free plan.', // Apps Message
};

TrialButton.propTypes = {
	cluster: string,
	user: object.isRequired,
	currentApp: string.isRequired,
	isCluster: bool,
	trialMessage: string,
	daysLeft: Number.isRequired,
	clusterDaysLeft: Number.isRequired,
};

export default TrialButton;
