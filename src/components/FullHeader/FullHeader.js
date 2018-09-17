import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { object } from 'prop-types';
import { connect } from 'react-redux';

import Logo from '../Logo';
import UserMenu from '../AppHeader/UserMenu';
import headerStyles from './styles';

const { Header } = Layout;

const getSelectedKeys = (pathname) => {
	switch (pathname) {
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
	</Header>
);

FullHeader.propTypes = {
	user: object.isRequired,
};

const mapStateToProps = state => ({
	user: state.user.data,
});

export default connect(mapStateToProps)(FullHeader);
