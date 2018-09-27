import React from 'react';
import { Layout } from 'antd';

import { mediaKey } from '../../utils/media';

const { Header } = Layout;

const WhiteHeader = ({ children, compact, ...props }) => (
	<Header
		css={{
			backgroundColor: '#fff',
			height: 'auto',
			boxShadow: '0 1px 1px 0 rgba(0,0,0,0.05)',
		}}
		{...props}
	>
		<div
			css={{
				padding: compact ? '25px 0px' : '45px 25px',
				margin: '0 auto',
				maxWidth: compact ? 'none' : 1300,

				[mediaKey.medium]: {
					padding: '40px 0 25px',
				},
			}}
		>
			{children}
		</div>
	</Header>
);

export default WhiteHeader;
