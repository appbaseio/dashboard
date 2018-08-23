import React from 'react';
import { Layout } from 'antd';

const { Header } = Layout;

const WhiteHeader = ({ children, ...props }) => (
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
				padding: '45px 20px',
				margin: '0 auto',
				maxWidth: 1300,
			}}
		>
			{children}
		</div>
	</Header>
);

export default WhiteHeader;
