import React from 'react';
import { Row, Col, Progress } from 'antd';
import get from 'lodash/get';
import PropTypes from 'prop-types';

import { compressNumber, planLimits, getAppCount } from '../../utils/helper';
import { headingText, statsText, statsContainer } from './styles';

const UsageRenderer = ({ computedMetrics, plan }) => {
	const appCount = getAppCount(computedMetrics, plan);
	const action = Math.ceil(get(appCount, 'action.percentage'));
	const record = Math.ceil(get(appCount, 'records.percentage'));

	return (
		<Row gutter={20}>
			<Col span={12}>
				<Row gutter={15}>
					<Col span={10} className={statsContainer}>
						<Progress
							width={60}
							type="circle"
							percent={action}
							format={percent => `${percent}%`}
							status={action > 90 ? 'exception' : null}
						/>
					</Col>
					<Col span={14} className={statsContainer}>
						<h3 className={headingText}>API Calls</h3>
						<h4 className={statsText}>
							<span style={{ fontWeight: '600' }}>
								{compressNumber(get(appCount, 'action.count'))}{' '}
							</span>
							<span>/{compressNumber(planLimits[plan].action)}</span>
						</h4>
					</Col>
				</Row>
			</Col>
			<Col span={12}>
				<Row gutter={15}>
					<Col span={10} className={statsContainer}>
						<Progress
							width={60}
							type="circle"
							percent={record}
							format={percent => `${percent}%`}
							status={record > 90 ? 'exception' : null}
						/>
					</Col>
					<Col span={14} className={statsContainer}>
						<h3 className={headingText}>Records</h3>
						<h4 className={statsText}>
							<span style={{ fontWeight: '600' }}>
								{compressNumber(get(appCount, 'records.count'))}{' '}
							</span>
							<span>/{compressNumber(planLimits[plan].records)}</span>
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
