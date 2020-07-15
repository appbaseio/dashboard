import React from 'react';
import { Card, Skeleton, Icon } from 'antd';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import UsageRenderer from './UsageRenderer';
import ActionButtons from './ActionButtons';
import { cardActions, skeleton } from './styles';

const AppCard = ({ title, data, appName, appId, permissions, shared }) => (
	<Card
		title={title}
		style={{
			paddingBottom: '15px',
			overflow: 'hidden',
		}}
		bodyStyle={{ paddingBottom: '40px' }}
		className={cardActions}
	>
		{/* Free Plan is taken as default */}
		<Skeleton
			className={skeleton}
			title={false}
			paragraph={{ rows: 2 }}
			loading={!(data && data[appName])}
		>
			{data && data[appName] ? (
				<UsageRenderer
					plan={get(data, `${appName}.tier`, 'free')}
					computedMetrics={{
						calls: get(data, `${appName}.api_calls`),
						records: get(data, `${appName}.records`),
					}}
				/>
			) : null}
		</Skeleton>

		<div
			css={{
				color: '#aaa',
				position: 'absolute',
				bottom: 10,
				textAlign: 'center',
				width: 'calc(100% - 48px)',
			}}
		>
			<Icon type="ellipsis" theme="outlined" />
		</div>

		<ActionButtons
			appName={appName}
			appId={appId}
			permissions={permissions}
			shared={shared}
		/>
	</Card>
);

AppCard.propTypes = {
	title: PropTypes.node.isRequired,
	appName: PropTypes.string.isRequired,
	appId: PropTypes.string.isRequired,
	data: PropTypes.object, // eslint-disable-line
	shared: PropTypes.bool, // eslint-disable-line
	permissions: PropTypes.object, // eslint-disable-line
};

export default AppCard;
