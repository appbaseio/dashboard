import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { object } from 'prop-types';
import { connect } from 'react-redux';

import Logo from '../Logo';
import UserMenu from '../AppHeader/UserMenu';
import MenuSlider from './MenuSlider';
import headerStyles from './styles';

const { Header } = Layout;

const getSelectedKeys = (pathname) => {
	switch (pathname) {
		case '/profile':
			return '3';
		case '/clusters':
			return '2';
		case '/':
			return '1';
		default:
			return null;
	}
};

const FullHeader = ({ user }) => (
	<Header className={headerStyles}>
		<div className="row">
			<Logo />
			<Menu
				mode="horizontal"
				className="options"
				defaultSelectedKeys={[getSelectedKeys(window.location.pathname)]}
			>
				<Menu.Item key="1">
					<Link to="/">Apps</Link>
				</Menu.Item>

				<Menu.Item key="2">
					<Link to="/clusters">Clusters</Link>
				</Menu.Item>
			</Menu>
		</div>
		<UserMenu user={user} />
		<MenuSlider isHomepage defaultSelectedKeys={[getSelectedKeys(window.location.pathname)]} />
	</Header>
);

FullHeader.propTypes = {
	user: object.isRequired,
};

const mapStateToProps = state => ({
	user: state.user.data,
});

export default connect(mapStateToProps)(FullHeader);
