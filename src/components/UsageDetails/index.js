import React from 'react';
import { Card, Button, Icon } from 'antd';
import { css } from 'emotion';
import { connect } from 'react-redux';
import { Circle } from 'rc-progress';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import Flex from '../../batteries/components/shared/Flex';
import { getAppMetricsByName, getAppPlanByName } from '../../batteries/modules/selectors';
import { compressNumber, planLimits, getAppCount } from '../../utils/helper';

const percentCls = css`
	top: 40px;
	position: absolute;
	width: 100%;
	text-align: center;
`;
const upgradeBtn = css`
	margin-top: 30px;
	width: 100%;
`;
const shouldShowUpgrade = (plan, appCount) => {
	if (plan === 'free') {
		return { show: true };
	}
	if (plan === 'growth') {
		return { show: false };
	}
	// if plan is bootsrap
	if (get(appCount, 'records.percentage') > 70 || get(appCount, 'action.percentage') > 70) {
		return { show: true, danger: true };
	}
	return { show: true };
};
const UsageDetails = ({ plan, computedMetrics, appName }) => {
	const appCount = getAppCount(computedMetrics, plan);
	const showUpgrade = shouldShowUpgrade(plan, appCount);
	return (
		<Card title="Usage this month" css="width: 300px;height: 100%">
			<Flex justifyContent="center" alignItems="center">
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
								<strong>{compressNumber(get(appCount, 'action.count'))}</strong>
								&nbsp;/&nbsp;
								<span>{compressNumber(planLimits[plan].action)}</span>
							</div>
						) : null}
					</Flex>
				</div>
				<div css="width: 100px;position: relative;margin-left: 20px">
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
								<strong>{compressNumber(get(appCount, 'records.count'))}</strong>
								&nbsp;/&nbsp;
								<span>{compressNumber(planLimits[plan].records)}</span>
							</div>
						) : null}
					</Flex>
				</div>
			</Flex>
			<Flex justifyContent="center" alignItems="center">
				{showUpgrade.show && (
					<Button
						css={upgradeBtn}
						href="billing"
						target="_blank"
						size="large"
						type={showUpgrade.danger ? 'danger' : 'primary'}
					>
						<Icon type="to-top" />
						Upgrade your Plan
					</Button>
				)}
			</Flex>
		</Card>
	);
};
UsageDetails.defaultProps = {
	computedMetrics: undefined,
};
UsageDetails.propTypes = {
	plan: PropTypes.string.isRequired,
	appName: PropTypes.string.isRequired,
	computedMetrics: PropTypes.object,
};

const mapStateToProps = state => ({
	appName: get(state, '$getCurrentApp.name'),
	plan: get(getAppPlanByName(state), 'plan'),
	computedMetrics: get(getAppMetricsByName(state), 'computedMetrics'),
});
export default connect(mapStateToProps)(UsageDetails);
