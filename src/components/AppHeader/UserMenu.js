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

const menuItem = css`
	display: flex;
	align-items: center;
`;

const link = css`
	margin-right: 30px;
	color: rgba(0, 0, 0, 0.65);
	i {
		margin-right: 4px;
	}
	${media.small(css`
		display: none;
	`)};
`;

const UserMenu = ({ user }) => {
	const menu = (
		<Menu>
			<Menu.Item className={menuItem}>
				<Icon type="edit" />
				<Link to="/profile">{user.email}</Link>
			</Menu.Item>
			<Menu.Divider />
			<Menu.Item onClick={handleLogout}>
				<Icon type="poweroff" theme="outlined" />
				Logout
			</Menu.Item>
		</Menu>
	);

	return (
		<Row justify="space-between" align="middle">
			<a
				href="https://docs.appbase.io/javascript/quickstart.html"
				className={link}
				target="_blank"
				rel="noopener noreferrer"
			>
				<Icon type="rocket" /> Docs
			</a>
			<Dropdown overlay={menu} className={userMenu} trigger={['click']}>
				<span style={{ cursor: 'pointer' }}>
					<Avatar src={user.picture} />
					&nbsp;&nbsp;
					{user ? user.name : 'Loading...'}
					&nbsp;&nbsp;
					<Icon type="down" />
				</span>
			</Dropdown>
		</Row>
	);
};

UserMenu.propTypes = {
	user: object.isRequired,
};

export default UserMenu;
