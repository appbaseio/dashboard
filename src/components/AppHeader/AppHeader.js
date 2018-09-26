import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { string, object, bool } from 'prop-types';
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

const AppHeader = ({ currentApp, user, big }) => (
	<Header
		className={headerStyles}
		css={{ width: big ? 'calc(100% - 80px)' : 'calc(100% - 260px)' }}
	>
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
		<UserMenu user={user} />
	</Header>
);

AppHeader.propTypes = {
	currentApp: string,
	user: object.isRequired,
	big: bool.isRequired,
};

AppHeader.defaultProps = {
	currentApp: null,
};

const mapStateToProps = state => ({
	currentApp: get(state, '$getCurrentApp.name'),
	user: state.user.data,
});

export default connect(mapStateToProps)(AppHeader);
