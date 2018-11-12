// @flow

import React, { Component, Fragment } from 'react';
import {
 Switch, Route, Redirect, withRouter,
} from 'react-router-dom';
import { Menu } from 'antd';

import Account from './Account';
import Email from './Email';
import Credentials from './Credentials';
import CloseAccount from './CloseAccount';
import FullHeader from '../../components/FullHeader';
import Flex from '../../batteries/components/shared/Flex';

import { mediaKey, breakpoints } from '../../utils/media';

const { Item } = Menu;

type Props = {
	history: any,
};

class Profile extends Component<Props> {
	handleMenuClick = (item) => {
		const {
			history: { push },
		} = this.props;
		push(`/profile/${item.key}`);
	};

	render() {
		const {
			history: {
				location: { pathname },
			},
		} = this.props;
		const pathParts = pathname.split('/');

		return (
			<Fragment>
				<FullHeader />
				<Flex
					css={{
						flexDirection: 'row',
						padding: 40,
						justifyContent: 'center',
						margin: '0 auto',
						width: '75%',
						[mediaKey.small]: {
							flexDirection: 'column',
							padding: 0,
							width: '100%',
						},
					}}
				>
					<div>
						<Menu
							onClick={this.handleMenuClick}
							defaultSelectedKeys={[pathParts[2] || 'account']}
							mode={window.innerWidth <= breakpoints.medium ? 'horizontal' : 'inline'}
							css={{
								backgroundColor: 'transparent',
								borderRight: 0,
								marginRight: 15,
								width: '180px',
								[mediaKey.small]: {
									marginBottom: 10,
									marginRight: 0,
									width: '100% !important',
								},
							}}
						>
							<Item key="account">Account</Item>
							<Item key="email">Email</Item>
							<Item key="credentials">Credentials</Item>
							<Item key="close">Close Account</Item>
						</Menu>
					</div>
					<div
						css={{
							flex: 1,
							[mediaKey.small]: {
								padding: 10,
							},
						}}
					>
						<Switch>
							<Route path="/profile/account" component={Account} />
							<Route path="/profile/email" component={Email} />
							<Route path="/profile/credentials" component={Credentials} />
							<Route path="/profile/close" component={CloseAccount} />
							<Redirect from="/profile" exact to="/profile/account" />
						</Switch>
					</div>
				</Flex>
			</Fragment>
		);
	}
}

export default withRouter(Profile);
