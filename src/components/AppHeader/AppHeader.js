import React from 'react';
import {
 Layout, Menu, Dropdown, Icon,
} from 'antd';
import { css } from 'react-emotion';
import { connect } from 'react-redux';
import get from 'lodash/get';

import headerStyles from './styles';
import { setCurrentApp } from '../../batteries/modules/actions';

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
const list = css`
	max-height: 300px;
	overflow-y: scroll;

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}
`;

const AppHeader = ({ currentApp, apps, updateCurrentApp }) => {
	const menu = (
		<Menu>
			<Menu.ItemGroup className={list}>
				{Object.keys(apps).map(app => (
					<Menu.Item key={app}>
						<a title={app} role="link" onClick={() => updateCurrentApp(app, apps[app])}>
							{app}
						</a>
					</Menu.Item>
				))}
			</Menu.ItemGroup>
			<Menu.Divider />
			<Menu.Item key="3">Create a new app</Menu.Item>
		</Menu>
	);

	return (
		<Header className={headerStyles}>
			<Menu mode="horizontal">
				<Menu.Item key="1" className={noBorder}>
					<Dropdown overlay={menu} trigger={['click']}>
						<span>
							{currentApp || 'Loading...'} <Icon type="down" />
						</span>
					</Dropdown>
				</Menu.Item>
			</Menu>
		</Header>
	);
};

const mapStateToProps = state => ({
	currentApp: get(state, '$getCurrentApp.name'),
	apps: state.apps,
});

const mapDispatchToProps = dispatch => ({
	updateCurrentApp: (appName, appId) => dispatch(setCurrentApp(appName, appId)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(AppHeader);
