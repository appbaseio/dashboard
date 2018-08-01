import React from 'react';
import { Icon, Spin } from 'antd';
import Flex from '../../../shared/Flex';

export default () => {
	const antIcon = <Icon type="loading" style={{ fontSize: 50, marginTop: '250px' }} spin />;
	return (
		<Flex justifyContent="center" alignItems="center">
			<Spin indicator={antIcon} />
		</Flex>
	);
};
