import React from 'react';
import { Link } from 'react-router-dom';
import { object } from 'prop-types';
import {
	DownOutlined,
	PoweroffOutlined,
	SettingOutlined,
} from '@ant-design/icons';
import { Menu, Avatar, Dropdown } from 'antd';
import get from 'lodash/get';
import { css } from 'react-emotion';
import { media } from '../../utils/media';
import { ACC_API } from '../../constants/config';

const logoutURL = `${ACC_API}/logout?next=https://appbase.io`;

const handleLogout = () => {
	localStorage.setItem('hasVisitedTutorial', false);
	window.location.href = logoutURL;
};

const userMenu = css`
	${media.medium(css`
		display: none;
	`)};
`;

const userName = css`
	${media.large(css`
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
				<h4>{get(user, 'email')}</h4>
			</Menu.Item>
			<Menu.Divider />
			<Menu.Item>
				<Link to="/profile">
					<SettingOutlined style={{ marginRight: 8 }} />
					Account Settings
				</Link>
			</Menu.Item>
			<Menu.Divider />
			<Menu.Item onClick={handleLogout}>
				<PoweroffOutlined />
				Logout
			</Menu.Item>
		</Menu>
	);

	return (
		<Dropdown overlay={menu} className={userMenu} trigger={['click']}>
			<span style={{ cursor: 'pointer' }}>
				<Avatar
					src={get(user, 'picture')}
					css={{ backgroundColor: '#1890ff' }}
				>
					{get(user, 'name', '')
						.charAt(0)
						.toLocaleUpperCase()}
				</Avatar>
				&nbsp;&nbsp;
				<span className={userName}>
					{get(user, 'name', 'Loading...')}
				</span>
				&nbsp;&nbsp;
				<DownOutlined />
			</span>
		</Dropdown>
	);
};

UserMenu.propTypes = {
	user: object.isRequired,
};

export default UserMenu;
