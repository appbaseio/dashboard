import React from 'react';
import { FrownOutlined } from '@ant-design/icons';
import { Button } from 'antd';

const NoMatch = () => (
	<section
		css={{
			height: '100vh',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
		}}
	>
		<FrownOutlined style={{ fontSize: 44, marginBottom: 20 }} />
		<h2>Page not found</h2>
		<p>
			Sorry, we couldn
			{"'"}t find what you are looking for
		</p>
		<Button href="/" type="primary" size="large">
			Go Back to Dashboard
		</Button>
	</section>
);

export default NoMatch;
