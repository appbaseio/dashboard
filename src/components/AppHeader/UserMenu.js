import React from 'react';
import { Link } from 'react-router-dom';
import { func, object } from 'prop-types';
import { Menu, Avatar, Dropdown, Icon } from 'antd';
import get from 'lodash/get';
import { css } from 'react-emotion';
import { useAuth0 } from '@auth0/auth0-react';
import { media } from '../../utils/media';
import webAuth from '../../utils/WebAuthProxy';

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

const UserMenu = ({ user, resetAppbaseUser }) => {
	const { logout, isAuthenticated } = useAuth0();
	const handleLogout = () => {
		localStorage.setItem('hasVisitedTutorial', false);
		window.localStorage.removeItem('AUTH_0_ACCESS_TOKEN');

		try {
			if (isAuthenticated) {
				logout({
					returnTo: window.location.origin,
				});
			} else {
				webAuth.logout({
					returnTo: window.location.origin,
				});
			}
		} catch (error) {
			console.log('Error logging out...', error);
		} finally {
			resetAppbaseUser();
		}
	};
	const menu = (
		<Menu style={{ width: 'auto' }}>
			<Menu.Item className={userEmailDetail}>
				<h5>Logged in as</h5>
				<h4>{get(user, 'email')}</h4>
			</Menu.Item>
			<Menu.Divider />
			<Menu.Item>
				<Link to="/profile">
					<Icon
						style={{ marginRight: 8 }}
						type="setting"
						theme="outlined"
					/>
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
				<Icon type="down" />
			</span>
		</Dropdown>
	);
};

UserMenu.propTypes = {
	user: object.isRequired,
	resetAppbaseUser: func.isRequired,
};

export default UserMenu;
