import React from 'react';
import { Link } from 'react-router-dom';
import { object } from 'prop-types';
import {
 Menu, Avatar, Dropdown, Icon, Row,
} from 'antd';
import { css } from 'react-emotion';
import { media } from '../../utils/media';
import { ACC_API } from '../../constants/config';

const logoutURL = `${ACC_API}/logout?next=https://appbase.io`;

const handleLogout = () => {
	localStorage.setItem('hasVisitedTutorial', false);
	window.location.href = logoutURL;
};

const userMenu = css`
	${media.small(css`
		display: none;
	`)};
`;

const userEmailDetail = css`
	display: flex;
	flex-direction: column;
	pointer-events: none;
	&:hover {
		background: white;
	}
	h5,
	h4 {
		margin: 0;
	}
`;

const UserMenu = ({ user }) => {
	const menu = (
		<Menu style={{ width: 'auto' }}>
			<Menu.Item className={userEmailDetail}>
				<h5>Logged in as</h5>
				<h4>{user.email}</h4>
			</Menu.Item>
			<Menu.Divider />
			<Menu.Item>
				<Link to="/profile">
					<Icon style={{ marginRight: 8 }} type="setting" theme="outlined" />
					Account Settings
				</Link>
			</Menu.Item>
			<Menu.Divider />
			<Menu.Item onClick={handleLogout}>
				<Icon type="poweroff" theme="outlined" />
				Logout
			</Menu.Item>
		</Menu>
	);

	return (
		<Dropdown overlay={menu} className={userMenu} trigger={['click']}>
			<span style={{ cursor: 'pointer' }}>
				<Avatar src={user.picture} css={{ backgroundColor: '#1890ff' }}>
					{user.name && user.name.charAt(0).toLocaleUpperCase()}
				</Avatar>
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
