import React from 'react';
import {
 Layout, Menu, Avatar, Dropdown, Icon, Button,
} from 'antd';
import { css } from 'react-emotion';
import { connect } from 'react-redux';
import get from 'lodash/get';

import headerStyles from './styles';
// import { setCurrentApp } from '../../batteries/modules/actions';

const { Header } = Layout;
const noBorder = css`
	border: 0 !important;

	span {
		color: rgba(0, 0, 0, 0.65) !important;
	}

	&:hover span,
	&:focus span {
		color: #1890ff !important;
	}
`;

const menuButton = css`
	color: rgba(0, 0, 0, 0.65);
	border: 0;
	width: 100%;
	text-align: left;
`;
// const list = css`
// 	max-height: 300px;
// 	overflow-y: scroll;

// 	ul {
// 		list-style: none;
// 		margin: 0;
// 		padding: 0;
// 	}
// `;

const renderUserDropdown = (user) => {
	const menu = (
		<Menu
			onClick={(e) => {
				window.location.href = e.key;
			}}
		>
			<Menu.Item key="/profile">
				<Button ghost className={menuButton}>
					{user.email}
					<Icon type="edit" />
				</Button>
			</Menu.Item>
			<Menu.Item key="/logout">
				<Button ghost className={menuButton}>
					Logout
					<Icon type="poweroff" />
				</Button>
			</Menu.Item>
		</Menu>
	);

	return (
		<div>
			<Avatar src={user.picture} />
			<Dropdown overlay={menu} trigger={['click']}>
				<Button className={noBorder}>
					{user.name}
					<Icon type="down" />
				</Button>
			</Dropdown>
		</div>
	);
};

const AppHeader = ({ currentApp, user }) => (
	<Header className={headerStyles}>
		<Menu mode="horizontal">
			<Menu.Item key="1" className={noBorder}>
				<span>{currentApp || 'Loading...'}</span>
				{/* <Dropdown overlay={menu} trigger={['click']}>
						<span>
							{currentApp || 'Loading...'} <Icon type="down" />
						</span>
					</Dropdown> */}
			</Menu.Item>
		</Menu>
		{renderUserDropdown(user)}
	</Header>
);
const mapStateToProps = state => ({
	currentApp: get(state, '$getCurrentApp.name'),
	user: state.user.data,
	// apps: state.apps,
});

// const mapDispatchToProps = dispatch => ({
// 	updateCurrentApp: (appName, appId) => dispatch(setCurrentApp(appName, appId)),
// });

export default connect(
	mapStateToProps,
	// mapDispatchToProps,
)(AppHeader);
