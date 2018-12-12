import React, { Component } from 'react';
import get from 'lodash/get';
import {
 Card, Table, Popconfirm, Tooltip, Button,
} from 'antd';
import { connect } from 'react-redux';
import {
 string, func, bool, array,
} from 'prop-types';
import CreateCredentials from '../../components/CreateCredentials';
import Container from '../../components/Container';
import {
	getAppInfoByName,
	getAppPermissionsByName,
	getAppPlanByName,
} from '../../batteries/modules/selectors';
import Permission from './Permission';
import { displayErrors } from '../../utils/helper';
import {
	getPermission,
	createPermission,
	deletePermission,
	updatePermission,
	deleteApp,
} from '../../batteries/modules/actions';
// import joyrideSteps from './joyrideSteps';
// import Walkthrough from '../../batteries/components/shared/Walkthrough';
import Loader from '../../batteries/components/shared/Loader/Spinner';
import Banner from '../../batteries/components/shared/UpgradePlan/Banner';

const columns = [
	{
		title: 'Type',
		key: 'description',
		render: ({ permissionInfo }) => permissionInfo.description || 'No Description',
		width: '50%',
	},
	{
		title: 'Credentials',
		render: permission => <Permission {...permission} />,
		key: 'credentials',
		width: '50%',
	},
];
const bannerMessagesCred = {
	free: {
		title: 'API Credentials',
		description: 'Upgrade now to set granular ACLs, restrict by Referers and IP Sources, and more.',
		buttonText: 'Upgrade Now',
		href: 'billing',
	},
	bootstrap: {
		title: 'API Credentials',
		description: 'See how to effectively use security credentials to secure your app.',
		buttonText: 'Read Docs',
		href: 'https://docs.appbase.io/concepts/api-credentials.html',
	},
	growth: {
		title: 'API Credentials',
		description: 'See how to effectively use security credentials to secure your app.',
		buttonText: 'Read Docs',
		href: 'https://docs.appbase.io/concepts/api-credentials.html',
	},
};

class Credentials extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showCredForm: false,
			currentPermissionInfo: undefined,
		};
	}

	componentDidMount() {
		this.refetchPermissions();
	}

	componentDidUpdate(prevProps) {
		const { appName, errors } = this.props;
		if (prevProps.appName !== appName) {
			this.initialize();
		}
		displayErrors(errors, prevProps.errors);
	}

	refetchPermissions = () => {
		const { appName, fetchPermissions } = this.props;
		fetchPermissions(appName);
	};

	handleCancel = () => {
		this.setState({
			showCredForm: false,
		});
	};

	updatePermission = (request, username) => {
		const { appName, handleEditPermission } = this.props;
		handleEditPermission(appName, username, request).then(({ payload }) => {
			if (payload) {
				this.setState(
					{
						showCredForm: false,
					},
					() => {
						this.refetchPermissions();
					},
				);
			}
		});
	};

	showForm = (permissionInfo) => {
		if (permissionInfo) {
			this.setState({
				showCredForm: true,
				currentPermissionInfo: permissionInfo,
			});
		} else {
			this.setState({
				showCredForm: true,
				currentPermissionInfo: undefined,
			});
		}
	};

	newPermission = (request) => {
		const { appName, handleCreatePermission } = this.props;
		handleCreatePermission(appName, request).then(({ payload }) => {
			if (payload) {
				this.setState(
					{
						showCredForm: false,
					},
					() => {
						this.refetchPermissions();
					},
				);
			}
		});
	};

	deletePermission = (username) => {
		const { appName, handleDeletePermission } = this.props;
		handleDeletePermission(appName, username).then(({ payload }) => {
			if (payload) {
				this.refetchPermissions();
			}
		});
	};

	deleteApp = () => {
		const { handleDeleteApp, appId } = this.props;
		handleDeleteApp(appId).then(({ payload }) => {
			if (payload) {
				// Redirect to home
				window.location = window.origin;
			}
		});
	};

	handleSubmit = (form, username) => {
		const { currentPermissionInfo } = this.state;
		const requestPayload = { ...form.value.operationType, ...form.value };
		delete requestPayload.operationType;
		Object.keys(requestPayload).forEach((k) => {
			if (requestPayload[k] !== undefined) {
				if (k === 'ttl') {
					requestPayload[k] = parseInt(requestPayload[k], 10);
				}
				if (k === 'ip_limit') {
					requestPayload[k] = parseFloat(requestPayload[k], 10);
				}
			}
		});
		if (currentPermissionInfo || username) {
			this.updatePermission(requestPayload, username);
		} else {
			this.newPermission(requestPayload);
		}
	};

	render() {
		const { showCredForm, currentPermissionInfo, mappings } = this.state;
		const {
 isLoading, permissions, isOwner, isDeleting, plan,
} = this.props;
		if (isLoading && !(permissions && permissions.length)) {
			return <Loader />;
		}
		return (
			<React.Fragment>
				<Banner {...bannerMessagesCred[plan]} />
				{/* <Walkthrough component="Credentials" joyrideSteps={joyrideSteps} /> */}
				<Container>
					<Card title="Credentials">
						<Table
							scroll={{ x: 700 }}
							dataSource={permissions.map(permission => ({
								permissionInfo: permission,
								deletePermission: this.deletePermission,
								showForm: this.showForm,
							}))}
							rowKey={row => `${get(row, 'permissionInfo.username')}${get(
									row,
									'permissionInfo.password',
								)}`
							}
							columns={columns}
							css="tr:hover td {
								background: transparent;
							}"
							style={
								isDeleting
									? {
											pointerEvents: 'none',
											opacity: 0.6,
									  }
									: null
							}
						/>
					</Card>
					{showCredForm && (
						<CreateCredentials
							disabled={!isOwner}
							titleText={!isOwner ? 'Credentials Details' : undefined}
							onSubmit={this.handleSubmit}
							show={showCredForm}
							handleCancel={this.handleCancel}
							mappings={mappings}
							initialValues={currentPermissionInfo}
						/>
					)}
					{isOwner && (
						<Button
							style={{
								margin: '10px 0px',
							}}
							onClick={() => this.showForm()}
							size="large"
							type="primary"
							className="credentials-tutorial-1"
						>
							New Credentials
						</Button>
					)}
					{isOwner && (
						<Tooltip
							placement="rightTop"
							title="Deleting an app is a permanent action, and will delete all the associated data, credentials and team sharing settings."
						>
							<Popconfirm
								title="Are you sure delete this app?"
								onConfirm={this.deleteApp}
								okText="Yes"
								cancelText="No"
								placement="topLeft"
							>
								<Button
									style={{
										margin: '10px 10px',
										float: 'right',
									}}
									type="danger"
									size="large"
								>
									Delete App
								</Button>
							</Popconfirm>
						</Tooltip>
					)}
				</Container>
			</React.Fragment>
		);
	}
}
Credentials.defaultProps = {
	isLoading: false,
	isDeleting: false,
};
Credentials.propTypes = {
	appName: string.isRequired,
	plan: string.isRequired,
	appId: string.isRequired,
	permissions: array.isRequired,
	fetchPermissions: func.isRequired,
	handleCreatePermission: func.isRequired,
	handleDeletePermission: func.isRequired,
	handleEditPermission: func.isRequired,
	isOwner: bool.isRequired,
	isLoading: bool,
	isDeleting: bool,
	errors: array.isRequired,
	handleDeleteApp: func.isRequired,
};
const mapStateToProps = (state) => {
	const appOwner = get(getAppInfoByName(state), 'owner');
	const userEmail = get(state, 'user.data.email');
	const appPermissions = getAppPermissionsByName(state);
	const planState = getAppPlanByName(state);
	return {
		appName: get(state, '$getCurrentApp.name'),
		plan: get(planState, 'plan'),
		appId: get(state, '$getCurrentApp.id'),
		permissions: get(appPermissions, 'results', []),
		isPaidUser: get(planState, 'isPaid'),
		isOwner: appOwner === userEmail,
		isLoading: get(state, '$getAppPermissions.isFetching'),
		isDeleting: get(state, '$deleteAppPermission.isFetching'),
		errors: [
			get(state, '$getAppPermissions.error'),
			get(state, '$createAppPermission.error'),
			get(state, '$deleteAppPermission.error'),
			get(state, '$updateAppPermission.error'),
			get(state, '$deleteApp.error'),
		],
	};
};
const mapDispatchToProps = dispatch => ({
	fetchPermissions: appName => dispatch(getPermission(appName)),
	handleCreatePermission: (appName, payload) => dispatch(createPermission(appName, payload)),
	handleDeletePermission: (appName, username) => dispatch(deletePermission(appName, username)),
	handleEditPermission: (appName, username, payload) => dispatch(updatePermission(appName, username, payload)),
	handleDeleteApp: appId => dispatch(deleteApp(appId)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Credentials);
