import React from 'react';
import get from 'lodash/get';
import {
 Card, Input, Form, Button, Icon, Table, message,
} from 'antd';
import { connect } from 'react-redux';

import { css } from 'emotion';
import Container from '../../components/Container';
import Banner from '../../batteries/components/shared/UpgradePlan/Banner';
import Overlay from '../../components/Overlay';
import { getAppPermissionsByName, getAppPlanByName } from '../../batteries/modules/selectors';

import { getPermission, getPublicKey } from '../../batteries/modules/actions';
import { setRole } from '../../utils';

const { Column, ColumnGroup } = Table;

const formLabelStyle = css`
	label {
		font-weight: 600;
		color: #595959;
	}
`;

const labelMargin = {
	marginBottom: 5,
};
const bannerMessagesCred = {
	free: {
		title: 'Role Base Access',
		description:
			'Upgrade now to set granular ACLs, restrict by Referers and IP Sources, and more.',
		buttonText: 'Upgrade Now',
		href: 'billing',
	},
	bootstrap: {
		title: 'Role Base Access',
		description: 'See how to effectively use security credentials to secure your app.',
		buttonText: 'Read Docs',
		href: 'https://docs.appbase.io/concepts/api-credentials.html',
	},
	growth: {
		title: 'Role Base Access',
		description: 'See how to effectively use security credentials to secure your app.',
		buttonText: 'Read Docs',
		href: 'https://docs.appbase.io/concepts/api-credentials.html',
	},
};

class RoleBaseAccess extends React.Component {
	componentDidMount() {
		const {
 			isPaidUser, fetchPublicKey, appName, fetchPermissions,
		} = this.props; // prettier-ignore
		if (isPaidUser) {
			fetchPublicKey(appName);
			fetchPermissions(appName);
		}
	}

	handleRole = (e) => {
		this.setState({
			[e.target.name]: e.target.value,
		});
	};

	saveRole = async (value) => {
		try {
			const { appName } = this.props;
			const role = this.state && this.state[value.username];
			const response = await setRole(appName, value.username, role);
			if (response.status >= 400) {
				message.error('Erro');
			}
			message.success(response.message);
		} catch (e) {
			message.error(e.message);
		}
	};

	render() {
		const { plan, isPaidUser, permissions } = this.props;

		return (
			<React.Fragment>
				<Banner {...bannerMessagesCred[plan]} />
				{isPaidUser ? (
					<Container>
						<Card title="JWT Public Key">
							<p>
								The public key is used for verifying the JWT tokens for this app.
								Read more.
							</p>
							<Form layout="vertical" className={formLabelStyle}>
								<Form.Item label="Public Key" style={labelMargin}>
									<Input.TextArea rows={3} placeholder="Enter Public Key" />
								</Form.Item>
								<Form.Item label="Define Role" style={labelMargin}>
									<Input placeholder="Enter Role" />
								</Form.Item>
								<Form.Item style={labelMargin}>
									<Button type="primary">
										<Icon type="save" />
										Submit
									</Button>
								</Form.Item>
							</Form>
						</Card>
						<Card title="Map Roles to API Credentials.">
							<p>
								You can map your existing API Credentials to any role name. This
								role name should be present in your Roles Key field of the JWT
								token. Read more.
							</p>
							<Table dataSource={permissions}>
								<Column
									title="Credentials"
									key="credentials"
									render={value => `${value.username}:${value.password}`}
								/>
								<Column
									title="Description"
									key="description"
									render={value => (value && value.description) || 'No Description'
									}
								/>
								<Column
									title="Role"
									key="role"
									render={value => (
										<Input
											defaultValue={value && value.role}
											name={value.username}
											onChange={this.handleRole}
											placeholder="Define Role"
										/>
									)}
								/>

								<Column
									title="Action"
									key="action"
									render={value => (
										<Button
											shape="circle"
											disabled={
												!this.state
												|| (!this.state[`${value.username}`]
													&& this.state[`${value.username}`] === value.role)
											}
											onClick={() => this.saveRole(value)}
											icon="save"
											type="primary"
										/>
									)}
								/>
							</Table>
						</Card>
					</Container>
				) : (
					<Overlay
						style={{
							maxWidth: '70%',
						}}
						src="/static/images/analytics/Analytics.png"
						alt="analytics"
					/>
				)}
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => {
	const planState = getAppPlanByName(state);
	const appPermissions = getAppPermissionsByName(state);
	const loading =		get(state, '$getAppPermissions.isFetching') || get(state, '$getAppPublicKey.isFetching');
	return {
		appName: get(state, '$getCurrentApp.name'),
		plan: get(planState, 'plan'),
		isPaidUser: get(planState, 'isPaid'),
		permissions: get(appPermissions, 'results', []),
		isLoading: loading,
		publicKey: get(state, '$getAppPublicKey.results'),
	};
};
const mapDispatchToProps = dispatch => ({
	fetchPermissions: appName => dispatch(getPermission(appName)),
	fetchPublicKey: appName => dispatch(getPublicKey(appName)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(RoleBaseAccess);
