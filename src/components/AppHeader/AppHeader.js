import React from 'react';
import {
 Layout, Menu, Icon, Button, Tooltip,
} from 'antd';
import { Link } from 'react-router-dom';
import {
 string, object, bool, number,
} from 'prop-types';
import { css } from 'react-emotion';
import { connect } from 'react-redux';
import get from 'lodash/get';

import { getAppInfoByName } from '../../batteries/modules/selectors';
import { media } from '../../utils/media';
import MenuSlider from '../FullHeader/MenuSlider';
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
const trialText = css`
	line-height: 2em;
	font-size: 0.9em;
`;
const trialBtn = css`
	${media.small(css`
		display: none;
	`)};
`;

const backIcon = css`
	i {
		margin: 0 auto !important;
	}
`;

const AppHeader = ({
 currentApp, user, big, isUsingTrial, daysLeft, appOwner,
}) => (
	<Header
		className={headerStyles}
		css={{ width: big ? 'calc(100% - 80px)' : 'calc(100% - 260px)' }}
	>
		<Menu mode="horizontal">
			<Menu.Item key="back" className={noBorder} style={{ padding: 0 }}>
				<Link to="/">
					<Button css={backIcon} shape="circle" icon="arrow-left" />
				</Link>
			</Menu.Item>
			<Menu.Item key="1" className={noBorder}>
				{appOwner
					&& (appOwner === user.email ? (
						<span>{currentApp || 'Loading...'}</span>
					) : (
						<Tooltip title={`Shared by ${appOwner}`}>
							<span>{currentApp || 'Loading...'}</span>
							<Icon style={{ marginLeft: 8 }} shape="circle" type="share-alt" />
						</Tooltip>
					))}
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
	appOwner: string.isRequired,
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

export default connect(mapStateToProps)(AppHeader);
