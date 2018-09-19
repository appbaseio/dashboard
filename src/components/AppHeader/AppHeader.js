import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { string, object } from 'prop-types';
import { css } from 'react-emotion';
import { connect } from 'react-redux';
import get from 'lodash/get';

import UserMenu from './UserMenu';
import headerStyles from './styles';

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

const AppHeader = ({ currentApp, user }) => (
	<Header className={headerStyles}>
		<Menu mode="horizontal">
			<Menu.Item key="back" className={noBorder} style={{ padding: 0 }}>
				<Link to="/">
					<Icon type="arrow-left" />
				</Link>
			</Menu.Item>
			<Menu.Item key="1" className={noBorder}>
				<span>{currentApp || 'Loading...'}</span>
			</Menu.Item>
		</Menu>
		<div>
			{/* <Button active href={`/app/${currentApp}/billing`} css="border: none">
				<Icon type="credit-card" />
			</Button> */}

			<UserMenu user={user} />
		</div>
	</Header>
);

AppHeader.propTypes = {
	currentApp: string,
	user: object.isRequired,
};

AppHeader.defaultProps = {
	currentApp: null,
};

const mapStateToProps = state => ({
	currentApp: get(state, '$getCurrentApp.name'),
	user: state.user.data,
});

export default connect(mapStateToProps)(AppHeader);
