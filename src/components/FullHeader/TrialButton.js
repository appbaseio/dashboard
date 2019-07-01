import React from 'react';
import { Button, Tag, Tooltip } from 'antd';
import { object, string, bool } from 'prop-types';
import { Link } from 'react-router-dom';
import { css } from 'react-emotion';

import { media } from '../../utils/media';

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

const buttonWithMessage = ({ daysLeft, redirectURL, trialMessage }) => (
	<Link className={trialLink} to={redirectURL}>
		<Tooltip title={trialMessage}>
			<Button css={trialBtn} type="danger">
				<span css={trialText}>
					{daysLeft > 0
						? `Trial expires in ${daysLeft} ${
								daysLeft > 1 ? 'days' : 'day'
						  }. Upgrade now`
						: 'Trial expired. Upgrade now'}
				</span>
			</Button>
		</Tooltip>
	</Link>
);

const TrialButton = (props) => {
	const {
		cluster, daysLeft, isCluster, currentApp, trialMessage, user: { apps },
	} = props; // prettier-ignore

	if (isCluster) {
		return (
			<Tooltip title="You are currently on a free 14-day trial. Once this expires, you will have to upgrade to a paid plan to continue accessing the cluster. The cluster will be removed after a trial expires.">
				<Tag color="red" css={trialBtn}>
					You are on trial.
				</Tag>
			</Tooltip>
		);
	}

	const appNames = apps ? Object.keys(apps) : [];
	const redirectApp = currentApp && appNames.includes(currentApp) ? currentApp : '';

	if (cluster) {
		return buttonWithMessage({
			daysLeft,
			trialMessage,
			redirectURL: `/clusters?id=${cluster}&subscription=true`,
		});
	}

	if (redirectApp) {
		return buttonWithMessage({
			daysLeft,
			trialMessage,
			redirectURL: `/app/${redirectApp}/billing`,
		});
	}

	return (
		<Tooltip title={trialMessage}>
			<Tag color="red">
				{daysLeft > 0
					? `Trial expires in ${daysLeft} ${daysLeft > 1 ? 'days' : 'day'}. Upgrade now`
					: 'Trial expired. Upgrade now'}
			</Tag>
		</Tooltip>
	);
};

TrialButton.defaultProps = {
	cluster: '',
	isCluster: false,
	trialMessage:
		'You are currently on a trial which unlocks all the Growth monthly features. You can upgrade to a paid plan anytime till the trial expires. Post trial expiration, you will be subscribed to the free plan.', // Apps Message
};

TrialButton.propTypes = {
	cluster: string,
	user: object.isRequired,
	currentApp: string.isRequired,
	isCluster: bool,
	trialMessage: string,
	daysLeft: Number.isRequired,
};

export default TrialButton;
