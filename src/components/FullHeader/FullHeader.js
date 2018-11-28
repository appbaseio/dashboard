import React from 'react';
import {
 Layout, Menu, Tag, Icon,
} from 'antd';
import { Link } from 'react-router-dom';
import { object, string } from 'prop-types';
import { connect } from 'react-redux';

import Logo from '../Logo';
import UserMenu from '../AppHeader/UserMenu';
import MenuSlider from './MenuSlider';
import headerStyles from './styles';

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

const FullHeader = ({ user, cluster }) => (
	<Header className={headerStyles}>
		<div className="row">
			<Logo />
			<Menu
				mode="horizontal"
				className="options"
				defaultSelectedKeys={
					cluster ? ['3'] : [getSelectedKeys(window.location.pathname)]
				}
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
		<UserMenu user={user} />
		<MenuSlider isHomepage defaultSelectedKeys={[getSelectedKeys(window.location.pathname)]} />
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
});

export default connect(mapStateToProps)(FullHeader);
