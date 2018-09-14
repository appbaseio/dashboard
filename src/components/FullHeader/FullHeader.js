import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';

import Logo from '../Logo';
import headerStyles from './styles';

const { Header } = Layout;

const getSelectedKeys = (pathname) => {
	switch (pathname) {
		case '/clusters':
			return '2';
		case '/profile':
			return '3';
		default:
			return '1';
	}
};
const FullHeader = () => (
	<Header className={headerStyles}>
		<Logo />
		<Menu mode="horizontal" defaultSelectedKeys={[getSelectedKeys(window.location.pathname)]}>
			<Menu.Item key="1">
				<Link to="/">Apps</Link>
			</Menu.Item>

			<Menu.Item key="2">
				<Link to="/clusters">Clusters</Link>
			</Menu.Item>

			<Menu.Item key="3">
				<Link to="/profile">Profile</Link>
			</Menu.Item>
		</Menu>
	</Header>
);

export default FullHeader;
