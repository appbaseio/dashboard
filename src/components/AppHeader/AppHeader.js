import React from 'react';
import { Layout, Menu, Dropdown, Icon } from 'antd';
import { css } from 'react-emotion';

import headerStyles from './styles';

const { Header } = Layout;
const noBorder = css`
	border: 0 !important;

	a {
		color: rgba(0, 0, 0, 0.65) !important;
	}

	&:hover a,
	&:focus a {
		color: #1890ff !important;
	}
`;

const menu = (
	<Menu>
		<Menu.Item key="0">
			<a href="http://www.alipay.com/">1st menu item</a>
		</Menu.Item>
		<Menu.Item key="1">
			<a href="http://www.taobao.com/">2nd menu item</a>
		</Menu.Item>
		<Menu.Divider />
		<Menu.Item key="3">Create a new app</Menu.Item>
	</Menu>
);

const ApHeader = () => (
	<Header className={headerStyles}>
		<Menu mode="horizontal">
			<Menu.Item key="1" className={noBorder}>
				<Dropdown overlay={menu} trigger={['click']}>
					<a className="ant-dropdown-link" href="#">
						App name goes here <Icon type="down" />
					</a>
				</Dropdown>
			</Menu.Item>
		</Menu>
	</Header>
);

export default ApHeader;
