import React from 'react';
import { Card, Skeleton } from 'antd';
import PropTypes from 'prop-types';

import UsageRenderer from './UsageRenderer';

const AppCard = ({ title, data, appName }) => (
	<Card
		title={title}
		style={{ paddingBottom: '15px' }}
		bodyStyle={{ paddingBottom: '40px' }}
	>
		{/* Free Plan is taken as default */}
		<Skeleton title={false} paragraph={{ rows: 2 }} loading={!(data && data[appName])}>
			{data && data[appName] ? (
				<UsageRenderer
					plan="free"
					computedMetrics={{
						calls: data[appName].api_calls,
						records: data[appName].records,
					}}
				/>
			) : null}
		</Skeleton>
	</Card>
);

AppCard.propTypes = {
	title: PropTypes.node.isRequired,
	data: PropTypes.object, // eslint-disable-line
	appName: PropTypes.string.isRequired,
};

export default AppCard;
