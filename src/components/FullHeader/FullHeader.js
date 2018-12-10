import React from 'react';
import {
 Layout, Menu, Tag, Icon, Button, Row,
} from 'antd';
import { Link } from 'react-router-dom';
import { object, string } from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { css } from 'react-emotion';

import Logo from '../Logo';
import UserMenu from '../AppHeader/UserMenu';
import MenuSlider from './MenuSlider';
import headerStyles from './styles';
import { media } from '../../utils/media';
import { getUserPlan } from '../../batteries/modules/actions/account';

const { Header } = Layout;

const getSelectedKeys = (pathname) => {
	switch (pathname) {
		case '/clusters':
			return '2';
		case '/':
			return '1';
		default:
			return null;
	}
};

const trialText = css`
	line-height: 2em;
	font-size: 0.9em;
`;

const trialBtn = css`
	margin-right: 30px;
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

const FullHeader = ({
 user, cluster, isUsingTrial, daysLeft,
}) => (
	<Header className={headerStyles}>
		<div className="row">
			<Logo />
			<Menu
				mode="horizontal"
				className="options"
				defaultSelectedKeys={cluster ? ['3'] : [getSelectedKeys(window.location.pathname)]}
			>
				<Menu.Item key="1">
					<Link to="/">Apps</Link>
				</Menu.Item>

				<Menu.Item key="2">
					<Link to="/clusters">
						Clusters <Tag>Preview</Tag>
					</Link>
				</Menu.Item>

				{cluster ? (
					<Menu.Item key="3">
						<Link to={`/clusters/${cluster}`}>
							<Icon type="cluster" /> {cluster}
						</Link>
					</Menu.Item>
				) : null}
			</Menu>
		</div>
		<Row justify="space-between" align="middle">
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
		<MenuSlider
			isHomepage
			defaultSelectedKeys={[getSelectedKeys(window.location.pathname)]}
			isUsingTrial={isUsingTrial}
			daysLeft={daysLeft}
		/>
	</Header>
);

FullHeader.defaultProps = {
	cluster: '',
};

FullHeader.propTypes = {
	user: object.isRequired,
	cluster: string,
};

const mapStateToProps = state => ({
	user: state.user.data,
	isUsingTrial: get(state, '$getUserPlan.trial') || false,
	daysLeft: get(state, '$getUserPlan.daysLeft', 0),
});

const mapDispatchToProps = dispatch => ({
	getPlan: () => dispatch(() => getUserPlan()),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(FullHeader);
