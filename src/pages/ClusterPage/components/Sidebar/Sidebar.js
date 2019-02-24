import React from 'react';
import { Menu, Icon } from 'antd';
import styled from 'react-emotion';
import { Link } from 'react-router-dom';

export default function Sidebar({ id, isViewer }) {
	const baseRoute = `/clusters/${id}`;
	let defaultSelectedKeys;

	if (window.location.pathname === baseRoute) {
		defaultSelectedKeys = ['1'];
	} else if (window.location.pathname.endsWith('/scale')) {
		defaultSelectedKeys = ['2'];
	} else {
		defaultSelectedKeys = ['3'];
	}
	return (
		<Menu
			css={{ width: 220, backgroundColor: 'transparent', border: 0 }}
			defaultSelectedKeys={defaultSelectedKeys}
			theme="light"
		>
			<Menu.Item key="1">
				<Link to={baseRoute}>
					<Icon type="cluster" /> Cluster
				</Link>
			</Menu.Item>
			{isViewer || (
				<Menu.Item key="2">
					<Link to={`${baseRoute}/scale`}>
						<Icon type="database" /> Scale Cluster
					</Link>
				</Menu.Item>
			)}
			{isViewer || (
				<Menu.Item key="3">
					<Link to={`${baseRoute}/share`}>
						<Icon type="share-alt" /> Share Settings
					</Link>
				</Menu.Item>
			)}
		</Menu>
	);
}

export const RightContainer = styled('section')`
	width: calc(100% - 240px);
	height: auto;
`;
