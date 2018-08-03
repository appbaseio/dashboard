import React from 'react';
import { Card } from 'antd';
import { css } from 'emotion';
import { Circle } from 'rc-progress';
import get from 'lodash/get';
import Flex from '../../shared/Flex';
import { common } from '../../shared/helper';
import { billingService } from '../../service/BillingService';
import { Button as UpgradeButton } from './../../../modules/batteries/components/Mappings/styles';

const percentCls = css`
	top: 40px;
	left: 35px;
	position: absolute;
`;
const UsageDetails = ({ plan, appCount }) => (
	<Card title="Usage this month" css="width: 300px">
		<Flex css="margin-top: 30px" justifyContent="space-between">
			<div css="width: 100px;position: relative">
				<div css={percentCls}>{`${get(appCount, 'action.percentage')}%`}</div>
				<Circle
					style={{
						minWidth: '100px',
					}}
					percent={get(appCount, 'action.percentage')}
					strokeWidth="5"
					trailWidth="5"
					strokeColor="#4F8FFD"
				/>
				<Flex flexDirection="column" justifyContent="center" alignItems="center">
					<div className="sub-title">API calls</div>
					{plan ? (
						<div>
							<strong>{common.compressNumber(get(appCount, 'action.count'))}</strong>&nbsp;/&nbsp;
							<span>
								{common.compressNumber(billingService.planLimits[plan].action)}
							</span>
						</div>
					) : null}
				</Flex>
			</div>
			<div css="width: 100px;position: relative">
				<div css={percentCls}>{`${get(appCount, 'records.percentage')}%`}</div>
				<Circle
					style={{
						minWidth: '100px',
					}}
					percent={get(appCount, 'records.percentage')}
					strokeWidth="5"
					trailWidth="5"
					strokeColor="#4F8FFD"
				/>
				<Flex flexDirection="column" justifyContent="center" alignItems="center">
					<div>Records</div>
					{plan ? (
						<div>
							<strong>{common.compressNumber(get(appCount, 'records.count'))}</strong>&nbsp;/&nbsp;
							<span>
								{common.compressNumber(billingService.planLimits[plan].records)}
							</span>
						</div>
					) : null}
				</Flex>
			</div>
		</Flex>
		<Flex justifyContent="center" alignItems="center">
			<UpgradeButton css="margin-top: 30px;" href="/billing" target="_blank">
				Upgrade Now
			</UpgradeButton>
		</Flex>
	</Card>
);

export default UsageDetails;
