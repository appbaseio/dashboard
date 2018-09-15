import React, { Component } from 'react';
import get from 'lodash/get';
import {
 Card, Table, Popconfirm, Tooltip,
} from 'antd';
import { connect } from 'react-redux';
import {
 string, func, bool, array,
} from 'prop-types';
import CreateCredentials from '../../components/CreateCredentials';
import Container from '../../components/Container';
import { getAppInfoByName, getAppPermissionsByName } from '../../batteries/modules/selectors';
import Button from '../../batteries/components/shared/Button/Primary';
import Permission from './Permission';
import { displayErrors } from '../../utils/helper';
import {
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
		const { appId, fetchPermissions } = this.props;
		fetchPermissions(appId);
	}

	componentDidUpdate(prevProps) {
		const { appName, errors } = this.props;
		if (prevProps.appName !== appName) {
			this.initialize();
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
		handleEditPermission(appId, username, request).then(({ payload }) => {
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
		const { appId, handleCreatePermission } = this.props;
		handleCreatePermission(appId, request).then(({ payload }) => {
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
		const { appId, handleDeletePermission } = this.props;
		handleDeletePermission(appId, username).then(({ payload }) => {
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
				)}
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
	permissions: array.isRequired,
	fetchPermissions: func.isRequired,
	handleCreatePermission: func.isRequired,
	handleDeletePermission: func.isRequired,
	handleEditPermission: func.isRequired,
	isOwner: bool.isRequired,
	isLoading: bool,
	errors: array.isRequired,
	handleDeleteApp: func.isRequired,
};
const mapStateToProps = (state) => {
	const appOwner = get(getAppInfoByName(state), 'owner');
	const userEmail = get(state, 'user.data.email');
	return {
		appName: get(state, '$getCurrentApp.name'),
		appId: get(state, '$getCurrentApp.id'),
		permissions: get(getAppPermissionsByName(state), 'results', []),
		isPaidUser: get(state, '$getAppPlan.isPaid'),
		isOwner: appOwner === userEmail,
		isLoading: get(state, '$getAppPermissions.isFetching'),
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
	fetchPermissions: appId => dispatch(getPermission(appId)),
	handleCreatePermission: (appId, payload) => dispatch(createPermission(appId, payload)),
	handleDeletePermission: (appId, username) => dispatch(deletePermission(appId, username)),
	handleEditPermission: (appId, username, payload) => dispatch(updatePermission(appId, username, payload)),
	handleDeleteApp: appId => dispatch(deleteApp(appId)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Credentials);
