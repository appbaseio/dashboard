import React from 'react';
import { Card } from 'antd';
import { css } from 'emotion';
import { Button as UpgradeButton } from './../../../../modules/batteries/components/Mappings/styles';

const headingMain = css`
	font-size: 30px;
	color: #212121;
	font-weight: 500;
`;
const desc = css`
	font-size: 16px;
	margin-top: 5px;
`;
const UpgradePlan = () => (
	<Card css="margin: 20px 0px">
		<div css={headingMain}>Unlock more potential</div>
		<div css={desc}>
			Our analytics feature can do much more! Discover what you could do by enabling our
			metrics on Clicks and Conversions, Filters, Results.
		</div>
		<UpgradeButton css="margin-top: 20px;margin: 20px 0px;" href="/billing" target="_blank">
			Upgrade Now
		</UpgradeButton>
	</Card>
);

export default UpgradePlan;
