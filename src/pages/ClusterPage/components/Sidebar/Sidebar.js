import React from 'react';
import { Menu, Icon } from 'antd';
import styled from 'react-emotion';
import { Link } from 'react-router-dom';

export default function Sidebar({ id, isViewer, isExternalCluster, isActive }) {
	const baseRoute = `/clusters/${id}`;
	let defaultSelectedKeys;

	if (window.location.pathname === baseRoute) {
		defaultSelectedKeys = ['1'];
	} else if (window.location.pathname.endsWith('/scale')) {
		defaultSelectedKeys = ['2'];
	} else if (window.location.pathname.endsWith('/share')) {
		defaultSelectedKeys = ['3'];
	} else if (window.location.pathname.endsWith('/usage')) {
		defaultSelectedKeys = ['4'];
	} else if (window.location.pathname.endsWith('/monitoring')) {
		defaultSelectedKeys = ['5'];
	} else {
		defaultSelectedKeys = ['6'];
	}

	return (
		<Menu
			css={{ width: 220, backgroundColor: 'transparent', border: 0 }}
			defaultSelectedKeys={defaultSelectedKeys}
			theme="light"
		>
			{!isActive || (
				<Menu.Item key="1">
					<Link to={baseRoute}>
						<Icon type="cluster" /> Cluster
					</Link>
				</Menu.Item>
			)}

			{isViewer || isExternalCluster || !isActive || (
				<Menu.Item key="2">
					<Link to={`${baseRoute}/scale`}>
						<Icon type="database" /> Scale Cluster
					</Link>
				</Menu.Item>
			)}
			{isViewer || !isActive || (
				<Menu.Item key="3">
					<Link to={`${baseRoute}/share`}>
						<Icon type="share-alt" /> Share Settings
					</Link>
				</Menu.Item>
			)}
			{!isActive || (
				<Menu.Item key="4">
					<Link to={`${baseRoute}/usage`}>
						<Icon type="bar-chart" /> View Usage
					</Link>
				</Menu.Item>
			)}

			{!isActive || (
				<Menu.Item key="5">
					<Link to={`${baseRoute}/monitoring`}>
						<Icon type="line-chart" /> Cluster Monitoring
					</Link>
				</Menu.Item>
			)}

			<Menu.Item key="6">
				<Link to={`${baseRoute}/logs`}>
					<Icon type="unordered-list" /> Deploy Logs
				</Link>
			</Menu.Item>
		</Menu>
	);
}

export const RightContainer = styled('section')`
	width: calc(100% - 240px);
	height: auto;
`;
