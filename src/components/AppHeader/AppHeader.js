import React from 'react';
import {
 Layout, Menu, Icon, Button, Row, Tag,
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
import { getAppInfo } from '../../batteries/modules/actions';

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

const link = css`
	margin-right: 30px;
	color: rgba(0, 0, 0, 0.65);
	i {
		margin-right: 4px;
	}
	${media.small(css`
		display: none;
	`)};
`;

class AppHeader extends React.Component {
	componentDidMount() {
		const { currentApp, fetchAppInfo, isAppInfoPresent } = this.props;
		if (!isAppInfoPresent) {
			fetchAppInfo(currentApp);
		}
	}

	render() {
		const {
			currentApp,
			user,
			big,
			isUsingTrial,
			daysLeft,
			history,
			match,
			appOwner,
			esVersion,
		} = this.props;

		return (
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
						{esVersion && <Tag>v{esVersion}</Tag>}
					</Menu.Item>
				</Menu>
				{isUsingTrial && (
					<Button css={trialBtn} type="danger" href="billing">
						<span css={trialText}>
							{daysLeft > 0
								? `Trial expires in ${daysLeft} ${
										daysLeft > 1 ? 'days' : 'day'
								  }. Upgrade now`
								: 'Trial expired. Upgrade now'}
						</span>
					</Button>
				)}
				<Row justify="space-between" align="middle">
					<a
						href="https://docs.appbase.io/javascript/quickstart.html"
						className={link}
						target="_blank"
						rel="noopener noreferrer"
					>
						<Icon type="rocket" /> Docs
					</a>
					<UserMenu user={user} />
				</Row>
				<MenuSlider />
			</Header>
		);
	}
}

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
	isAppInfoPresent: !!getAppInfoByName(state),
	esVersion: get(getAppInfoByName(state), 'es_version'),
	appOwner: get(getAppInfoByName(state), 'owner'),
	user: state.user.data,
});

const mapDispatchToProps = dispatch => ({
	fetchAppInfo: appName => dispatch(getAppInfo(appName)),
});

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps,
	)(AppHeader),
);
