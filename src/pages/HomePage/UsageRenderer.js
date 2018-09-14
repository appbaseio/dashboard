import React from 'react';
import { Row, Col, Progress } from 'antd';
import get from 'lodash/get';
import PropTypes from 'prop-types';

import { compressNumber, planLimits, getAppCount } from '../../utils/helper';
import { headingText, statsText } from './styles';

const UsageRenderer = ({ computedMetrics, plan }) => {
	const appCount = getAppCount(computedMetrics, plan);
	return (
		<Row gutter={20}>
			<Col span={12}>
				<Row gutter={15}>
					<Col span={10}>
						<Progress
							width={60}
							type="circle"
							percent={get(appCount, 'action.percentage')}
						/>
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
				<Row gutter={15}>
					<Col span={10}>
						<Progress
							width={60}
							type="circle"
							percent={get(appCount, 'records.percentage')}
						/>
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
