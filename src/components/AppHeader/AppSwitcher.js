import React from 'react';
import {
 Dropdown, Menu, Button, Icon,
} from 'antd';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { setCurrentApp } from '../../batteries/modules/actions';

const AppSwitcher = ({
 apps, currentApp, history, updateCurrentApp,
}) => {
	const menu = (
		<Menu
			style={{ maxHeight: 250, overflowY: 'scroll' }}
			onClick={(e) => {
				const appName = e.key;
				updateCurrentApp(appName, apps[appName]);
				history.push(`/app/${appName}`);
			}}
		>
			{Object.keys(apps).map(app => (
				<Menu.Item key={app}>{app}</Menu.Item>
			))}
		</Menu>
	);
	return (
		<Dropdown trigger={['click']} overlay={menu}>
			<Button style={{ border: 0 }}>
				{currentApp} <Icon type="down" />
			</Button>
		</Dropdown>
	);
};

const mapDispatchToProps = dispatch => ({
	updateCurrentApp: (appName, appId) => dispatch(setCurrentApp(appName, appId)),
});

export default withRouter(
	connect(
		null,
		mapDispatchToProps,
	)(AppSwitcher),
);
