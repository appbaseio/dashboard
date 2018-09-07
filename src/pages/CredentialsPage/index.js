import React, { Component } from 'react';
import get from 'lodash/get';
import {
	Card, Table, Popconfirm, Tooltip,
} from 'antd';
import { connect } from 'react-redux';
import {
 string, func, bool, array,
} from 'prop-types';
import CreateCredentials from './CreateCredentials';
import Container from '../../components/Container';
import { getCredntialsFromPermissions } from '../../batteries/utils';
import Button from '../../batteries/components/shared/Button/Primary';
import Permission from './Permission';
import { displayErrors } from '../../utils/helper';
import {
	getUserStatus,
	getAppInfo,
	getAppMappings,
	getPermission,
	createPermission,
	deletePermission,
	updatePermission,
	deleteApp,
} from '../../batteries/modules/actions';
import Loader from '../../batteries/components/shared/Loader/Spinner';

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

class Credentials extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showCredForm: false,
			currentPermissionInfo: undefined,
		};
	}

	componentDidMount() {
		const {
			checkUserStatus, fetchAppInfo, appId, fetchPermissions,
		} = this.props;
		checkUserStatus();
		fetchAppInfo(appId);
		fetchPermissions(appId);
	}

	componentDidUpdate(prevProps) {
		const {
 appName, errors, permissions, fetchMappings,
} = this.props;
		if (prevProps.appName !== appName) {
			this.initialize();
		}
		if (permissions !== prevProps.permissions && permissions.length) {
			// Fetch Mappings if permissions are present
			const credentials = getCredntialsFromPermissions(permissions);
			const { username, password } = credentials;
			fetchMappings(appName, `${username}:${password}`);
		}
		displayErrors(errors, prevProps.errors);
	}

	refetchPermissions = () => {
		const { appId, fetchPermissions } = this.props;
		fetchPermissions(appId);
	};

	handleCancel = () => {
		this.setState({
			showCredForm: false,
		});
	};

	updatePermission = (request, username) => {
		const { appId, handleEditPermission } = this.props;
		handleEditPermission(appId, username, request)
		.then(({ payload }) => {
			if (payload) {
				this.setState({
					showCredForm: false,
				}, () => {
					this.refetchPermissions();
				});
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
		const { appId, handleCreatePermission } = this.props;
		handleCreatePermission(appId, request).then(({ payload }) => {
			if (payload) {
				this.setState({
					showCredForm: false,
				}, () => {
					this.refetchPermissions();
				});
			}
		});
	};

	deletePermission = (username) => {
		const { appId, handleDeletePermission } = this.props;
		handleDeletePermission(appId, username).then(({ payload }) => {
			if (payload) {
				this.refetchPermissions();
			}
		});
	}

	deleteApp = () => {
		const { handleDeleteApp, appId } = this.props;
		handleDeleteApp(appId).then(({ payload }) => {
			if (payload) {
				// Redirect to home
				window.location = window.origin;
			}
		});
	}

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
		const { isLoading, permissions, isOwner } = this.props;
		if (isLoading) {
			return <Loader />;
		}
		return (
			<Container>
				<Card title="Credentials">
					<Table
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
					/>
				</Card>
				{showCredForm && (
					<CreateCredentials
						isOwner={isOwner}
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
					>
						New Credentials
					</Button>
				)}
				{
					isOwner && (
						<Tooltip placement="rightTop" title="Deleting an app is a permanent action, and will delete all the associated data, credentials and team sharing settings.">
							<Popconfirm
								title="Are you sure delete this app?"
								onConfirm={this.deleteApp}
								okText="Yes"
								cancelText="No"
							>
								<Button
									style={{
										margin: '10px 10px',
									}}
									danger
								>
									Delete App
								</Button>
							</Popconfirm>
						</Tooltip>

					)
				}
			</Container>
		);
	}
}
Credentials.defaultProps = {
	isLoading: false,
};
Credentials.propTypes = {
	appName: string.isRequired,
	appId: string.isRequired,
	checkUserStatus: func.isRequired,
	fetchAppInfo: func.isRequired,
	permissions: array.isRequired,
	fetchPermissions: func.isRequired,
	handleCreatePermission: func.isRequired,
	handleDeletePermission: func.isRequired,
	handleEditPermission: func.isRequired,
	fetchMappings: func.isRequired,
	isOwner: bool.isRequired,
	isLoading: bool,
	errors: array.isRequired,
	handleDeleteApp: func.isRequired,
};
const mapStateToProps = (state, ownProps) => {
	const appName = get(ownProps, 'match.params.appname');
	const appOwner = get(state, '$getAppInfo.app.owner');
	const userEmail = get(state, 'user.data.email');
	return {
		appName,
		appId: get(state, 'apps', {})[appName],
		permissions: get(state, '$getAppPermissions.results', []),
		isPaidUser: get(state, '$getUserStatus.isPaidUser'),
		isOwner: appOwner === userEmail,
		isLoading:
			get(state, '$getUserStatus.isFetching')
			|| get(state, '$getAppPermissions.isFetching')
			|| get(state, '$getAppInfo.isFetching'),
		errors: [
			get(state, '$getUserStatus.error'),
			get(state, '$getAppPermissions.error'),
			get(state, '$getAppInfo.error'),
			get(state, '$createAppPermission.error'),
			get(state, '$deleteAppPermission.error'),
			get(state, '$updateAppPermission.error'),
			get(state, '$deleteApp.error'),
		],
	};
};
const mapDispatchToProps = dispatch => ({
	checkUserStatus: () => dispatch(getUserStatus()),
	fetchPermissions: appId => dispatch(getPermission(appId)),
	fetchAppInfo: appId => dispatch(getAppInfo(appId)),
	fetchMappings: (appName, credentials) => dispatch(getAppMappings(appName, credentials)),
	handleCreatePermission: (appId, payload) => dispatch(createPermission(appId, payload)),
	handleDeletePermission: (appId, username) => dispatch(deletePermission(appId, username)),
	handleEditPermission: (appId, username, payload) => dispatch(updatePermission(appId, username, payload)),
	handleDeleteApp: appId => dispatch(deleteApp(appId)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Credentials);
