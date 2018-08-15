import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';

import Logo from '../Logo';
import headerStyles from './styles';

const { Header } = Layout;

const FullHeader = () => (
	<Header className={headerStyles}>
		<Logo />
		<Menu
			mode="horizontal"
			defaultSelectedKeys={[window.location.pathname === '/' ? '1' : '2']}
		>
			<Menu.Item key="1">
				<Link to="/">Apps</Link>
			</Menu.Item>

			<Menu.Item key="2">
				<Link to="/clusters">Clusters</Link>
			</Menu.Item>
		</Menu>
	</Header>
);

export default FullHeader;
