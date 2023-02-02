import React from 'react';

import {
	BarChartOutlined,
	ClusterOutlined,
	DatabaseOutlined,
	LineChartOutlined,
	ShareAltOutlined,
	UnorderedListOutlined,
} from '@ant-design/icons';

import { Menu } from 'antd';
import styled from 'react-emotion';
import { Link } from 'react-router-dom';
import { bool, string } from 'prop-types';

export default function Sidebar({
	id,
	isViewer,
	isExternalCluster,
	isActive,
	isSLSCluster,
}) {
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
						<ClusterOutlined /> Cluster
					</Link>
				</Menu.Item>
			)}

			{!isSLSCluster
				? isViewer ||
				  isExternalCluster || (
						<Menu.Item key="2">
							<Link to={`${baseRoute}/scale`}>
								<DatabaseOutlined /> Scale Cluster
							</Link>
						</Menu.Item>
				  )
				: null}
			{isViewer || !isActive || (
				<Menu.Item key="3">
					<Link to={`${baseRoute}/share`}>
						<ShareAltOutlined /> Share Settings
					</Link>
				</Menu.Item>
			)}
			{!isActive || (
				<Menu.Item key="4">
					<Link to={`${baseRoute}/usage`}>
						<BarChartOutlined /> View Usage
					</Link>
				</Menu.Item>
			)}

			{!isActive || (
				<Menu.Item key="5">
					<Link to={`${baseRoute}/monitoring`}>
						<LineChartOutlined /> Cluster Monitoring
					</Link>
				</Menu.Item>
			)}

			<Menu.Item key="6">
				<Link to={`${baseRoute}/logs`}>
					<UnorderedListOutlined /> Deploy Logs
				</Link>
			</Menu.Item>
		</Menu>
	);
}

Sidebar.defaultProps = {
	isViewer: false,
	isExternalCluster: false,
	isSLSCluster: false,
	isActive: false,
};

Sidebar.propTypes = {
	id: string.isRequired,
	isViewer: bool,
	isExternalCluster: bool,
	isSLSCluster: bool,
	isActive: bool,
};

export const RightContainer = styled('section')`
	width: calc(100% - 240px);
	height: auto;
`;
