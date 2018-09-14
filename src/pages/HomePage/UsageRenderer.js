import React from 'react';
import { Row, Col } from 'antd';
import { Circle } from 'rc-progress';
import get from 'lodash/get';
import PropTypes from 'prop-types';

import { compressNumber, planLimits, getAppCount } from '../../utils/helper';
import { headingText, statsText } from './styles';

const UsageRenderer = ({ computedMetrics, plan }) => {
	const appCount = getAppCount(computedMetrics, plan);
	const percentStat = {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%,-60%)',
	};
	return (
		<Row gutter={20}>
			<Col span={12}>
				<Row gutter={12}>
					<Col span={10}>
						<Circle
							percent={get(appCount, 'action.percentage')}
							strokeWidth="6"
							strokeColor="#1890ff"
						/>
						<h4 style={percentStat}>{`${get(appCount, 'action.percentage')}%`}</h4>
					</Col>
					<Col span={14}>
						<h3 className={headingText}>API Calls</h3>
						<h4 className={statsText}>
							{`${compressNumber(get(appCount, 'action.count'))}/${compressNumber(
								planLimits[plan].action,
							)}`}
						</h4>
					</Col>
				</Row>
			</Col>
			<Col span={12}>
				<Row gutter={12}>
					<Col span={10}>
						<Circle
							percent={get(appCount, 'records.percentage')}
							strokeWidth="6"
							strokeColor="#1890ff"
						/>
						<h4 style={percentStat}>{`${get(appCount, 'records.percentage')}%`}</h4>
					</Col>
					<Col span={14}>
						<h3 className={headingText}>Records</h3>
						<h4 className={statsText}>
							{`${compressNumber(get(appCount, 'records.count'))}/${compressNumber(
								planLimits[plan].records,
							)}`}
						</h4>
					</Col>
				</Row>
			</Col>
		</Row>
	);
};

UsageRenderer.propTypes = {
	plan: PropTypes.string.isRequired,
	computedMetrics: PropTypes.object.isRequired,
};

export default UsageRenderer;
