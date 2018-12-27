import React from 'react';
import { Menu, Icon } from 'antd';
import styled from 'react-emotion';

export default function Sidebar() {
	return (
		<Menu
			css={{ width: 220, backgroundColor: 'transparent', border: 0 }}
			defaultSelectedKeys={['1']}
			theme="light"
		>
			<Menu.Item key="1">
				<Icon type="cluster" /> Cluster
			</Menu.Item>
			<Menu.Item key="2">
				<Icon type="database" /> Node Scaling
			</Menu.Item>
			<Menu.Item key="3">
				<Icon type="share-alt" /> Sharing
			</Menu.Item>
		</Menu>
	);
}

export const RightContainer = styled('section')`
	width: calc(100% - 240px);
	height: auto;
`;
