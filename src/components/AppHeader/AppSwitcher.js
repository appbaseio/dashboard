import React from 'react';
import {
 Dropdown, Menu, Button, Icon, Tooltip,
} from 'antd';
import { connect } from 'react-redux';

import { setCurrentApp } from '../../batteries/modules/actions';

const AppSwitcher = ({
 apps, currentApp, history, updateCurrentApp, match, appOwner, user,
}) => {
	const {
		params: { route },
	} = match;
	const menu = (
		<Menu
			style={{ maxHeight: 250, overflowY: 'scroll' }}
			onClick={(e) => {
				const appName = e.key;
				updateCurrentApp(appName, apps[appName]);
				history.push(`/app/${appName}/${route || ''}`);
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
				<span>{currentApp || 'Loading...'}</span>
				{appOwner
					&& (appOwner !== user ? (
						<Tooltip
							title={`Shared by ${appOwner}`}
							trigger={['hover']}
							placement="bottom"
						>
							<Icon style={{ marginLeft: 8 }} shape="circle" type="share-alt" />
						</Tooltip>
					) : null)}
				<Icon type="down" />
			</Button>
		</Dropdown>
	);
};

const mapDispatchToProps = dispatch => ({
	updateCurrentApp: (appName, appId) => dispatch(setCurrentApp(appName, appId)),
});

export default connect(
	null,
	mapDispatchToProps,
)(AppSwitcher);
