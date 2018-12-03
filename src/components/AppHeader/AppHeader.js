import React from 'react';
import {
 Layout, Menu, Icon, Button,
} from 'antd';
import { Link, withRouter } from 'react-router-dom';
import {
 string, object, bool, number,
} from 'prop-types';
import { css } from 'react-emotion';
import { connect } from 'react-redux';
import get from 'lodash/get';

import { media } from '../../utils/media';
import MenuSlider from '../FullHeader/MenuSlider';
import UserMenu from './UserMenu';
import AppSwitcher from './AppSwitcher';
import headerStyles from './styles';

import { getAppInfoByName } from '../../batteries/modules/selectors';

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
const trialText = css`
	line-height: 2em;
	font-size: 0.9em;
`;
const trialBtn = css`
	${media.small(css`
		display: none;
	`)};
`;

const AppHeader = ({
 currentApp, user, big, isUsingTrial, daysLeft, history, match, appOwner,
}) => (
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
				<AppSwitcher
					appOwner={appOwner}
					user={user.email}
					apps={user.apps}
					currentApp={currentApp || 'Loading'}
					history={history}
					match={match}
				/>
			</Menu.Item>
		</Menu>
		{isUsingTrial && (
			<Button
				css={trialBtn}
				style={{
					height: 'auto',
				}}
				type="danger"
				href="billing"
			>
				<span css={trialText}>
					{daysLeft > 0
						? `Trial expires in ${daysLeft} ${
								daysLeft > 1 ? 'days' : 'day'
						  }. Upgrade now`
						: 'Trial expired. Upgrade now'}
				</span>
			</Button>
		)}
		<UserMenu user={user} />
		<MenuSlider />
	</Header>
);

AppHeader.propTypes = {
	currentApp: string,
	user: object.isRequired,
	isUsingTrial: bool.isRequired,
	daysLeft: number.isRequired,
	big: bool.isRequired,
};

AppHeader.defaultProps = {
	currentApp: null,
};

const mapStateToProps = state => ({
	isUsingTrial: get(state, '$getUserPlan.trial') || false,
	daysLeft: get(state, '$getUserPlan.daysLeft', 0),
	currentApp: get(state, '$getCurrentApp.name'),
	appOwner: get(getAppInfoByName(state), 'owner'),
	user: state.user.data,
});

export default withRouter(
	connect(
		mapStateToProps,
		null,
	)(AppHeader),
);
