import React from 'react';
import { Link } from 'react-router-dom';
import { object } from 'prop-types';
import {
 Menu, Avatar, Dropdown, Icon,
} from 'antd';
import { ACC_API } from '../../constants/config';

const logoutURL = `${ACC_API}/logout?next=https://appbase.io`;

const UserMenu = ({ user }) => {
	const menu = (
		<Menu>
			<Menu.Item>
				<Link to="/profile">{user.email}</Link>
			</Menu.Item>
			<Menu.Divider />
			<Menu.Item>
				<a href={logoutURL}>Logout</a>
			</Menu.Item>
		</Menu>
	);

	return (
		<Dropdown overlay={menu} trigger={['click']}>
			<span style={{ cursor: 'pointer' }}>
				<Avatar src={user.picture} />
				&nbsp;&nbsp;
				{user ? user.name : 'Loading...'}
				&nbsp;&nbsp;
				<Icon type="down" />
			</span>
		</Dropdown>
	);
};

UserMenu.propTypes = {
	user: object.isRequired,
};

export default UserMenu;
