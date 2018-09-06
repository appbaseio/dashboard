import React, { Component } from 'react';
import get from 'lodash/get';
import { notification, Card, Table } from 'antd';
import { connect } from 'react-redux';
import {
 string, func, bool, array,
} from 'prop-types';
import CreateCredentials from './CreateCredentials';
import { getMappings } from '../../batteries/utils/mappings';
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
	getAppCredentials,
	createPermission,
	deletePermission,
	updatePermission,
} from '../../batteries/modules/actions';
import PermissionCard from './PermissionCard';
import Loader from '../../batteries/components/shared/Loader/Spinner';
import DeleteApp from './DeleteApp';

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
			isSubmitting: false,
			showCredForm: false,
			mappings: {},
			currentPermissionInfo: undefined,
		};
	}

	componentDidMount() {
		this.initialize();
		const { checkUserStatus, getAppCred, appId } = this.props;
		checkUserStatus();
		getAppCred(appId);
	}

	componentDidUpdate(prevProps) {
		const { appName, errors, permissions, fetchMappings } = this.props;
		if (prevProps.appName !== appName) {
			this.initialize();
		}
		if (permissions !== prevProps.permissions) {
			// Fetch Mappings if permissions are present
			const credentials = getCredntialsFromPermissions(permissions);
			const { username, password } = credentials;
			fetchMappings(appName, `${username}:${password}`);
		}
		displayErrors(errors, prevProps.errors);
	}

	getInfo = () => {
		const { appId, fetchPermissions, fetchAppInfo } = this.props;
		fetchPermissions(appId);
		fetchAppInfo(appId);
	};

	handleCancel = () => {
		this.setState({
			showCredForm: false,
		});
	};

	updatePermission = (request, username) => {
		const { appId } = this.props;
		this.setState(
			{
				isSubmitting: true,
			},
			() => {
				updatePermission(appId, username, request).then(
					() => {
						this.getInfo();
						this.setState({
							isSubmitting: false,
							showCredForm: false,
						});
					},
					(e) => {
						notification.error({
							message: 'Error',
							description: get(
								e,
								'responseJSON.message',
								'Unable to save credentials',
							),
						});
						this.setState({
							isSubmitting: false,
						});
					},
				);
			},
		);
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
		// const { appId, handleCreatePermission } = this.props;
		// handleCreatePermission(appId, request).then((action) => {
		// 	if(action.payload) {
		// 		this.setState({
		// 			isSubmitting: false,
		// 		});
		// 	}
		// })
		// this.setState(
		// 	{
		// 		isSubmitting: true,
		// 	},
		// 	() => {
		// 		newPermission(appId, request).then(
		// 			() => {
		// 				this.getInfo();
		// 				this.setState({
		// 					isSubmitting: false,
		// 					showCredForm: false,
		// 				});
		// 			},
		// 			(e) => {
		// 				notification.error({
		// 					message: 'Error',
		// 					description: get(
		// 						e,
		// 						'responseJSON.message',
		// 						'Unable to save credentials',
		// 					),
		// 				});
		// 				this.setState({
		// 					isSubmitting: false,
		// 				});
		// 			},
		// 		);
		// 	},
		// );
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

	initialize() {
		this.getInfo();
	}

	renderElement(method) {
		let element = null;
		const { info, mappings } = this.state;
		const { appId, appName, isOwner } = this.props;
		switch (method) {
			case 'permissions':
				if (info && info.permission) {
					element = info.permission.body
						.sort((a, b) => {
							const first = a.description;
							const second = b.description;
							if (first < second) {
								return -1;
							}
							if (first > second) {
								return 1;
							}
							return 0;
						})
						.map((permissionInfo, index) => (
							<PermissionCard
								// eslint-disable-next-line
								key={index}
								appId={appId}
								appName={appName}
								isOwner={isOwner}
								permissionInfo={permissionInfo}
								mappings={mappings}
								getInfo={this.getInfo}
								showForm={this.showForm}
							/>
						));
				}
				break;
			case 'deleteApp':
				if (isOwner) {
					element = (
						<footer className="ad-detail-page-body other-page-body col-xs-12 delete-app-body">
							<div className="page-body col-xs-12">
								<section className="col-xs-12 p-0">
									<div className="col-xs-12 p-0">
										<DeleteApp appName={appName} appId={appId} />
									</div>
								</section>
							</div>
						</footer>
					);
				}
				break;
			default:
		}
		return element;
	}

	render() {
		const {
 isSubmitting, showCredForm, currentPermissionInfo, mappings,
} = this.state;
		const {
 appId, isLoading, permissions, isOwner,
} = this.props;
		if (isLoading) {
			return <Loader />;
		}
		return (
			<Container>
				<Card title="Credentials">
					<Table
						dataSource={permissions.map(permission => ({
							permissionInfo: permission,
							appId,
							showForm: this.showForm,
							getInfo: this.getInfo,
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
						isSubmitting={isSubmitting}
						isOwner={isOwner}
						onSubmit={this.handleSubmit}
						show={showCredForm}
						handleCancel={this.handleCancel}
						mappings={mappings}
						initialValues={currentPermissionInfo}
					/>
				)}
				{isOwner && <Button onClick={() => this.showForm()}>New Credentials</Button>}
			</Container>
		);
		// {this.renderElement('deleteApp')}
	}
}
Credentials.defaultProps = {
	isLoading: false,
};
Credentials.propTypes = {
	appName: string.isRequired,
	appId: string.isRequired,
	checkUserStatus: func.isRequired,
	permissions: array.isRequired,
	fetchPermissions: func.isRequired,
	isOwner: bool.isRequired,
	isLoading: bool,
	errors: array.isRequired,
};
const mapStateToProps = (state, ownProps) => {
	const appName = get(ownProps, 'match.params.appname');
	const appOwner = get(state, 'getAppInfo.app.owner');
	const userEmail = get(state, 'user.data.email');
	return {
		appName,
		appId: get(state, 'apps', {})[appName],
		userEmail: get(state, 'user.data.email'),
		permissions: get(state, '$permission.permissions'),
		isPaidUser: get(state, '$getUserStatus.isPaidUser'),
		isOwner: appOwner === userEmail,
		isLoading:
			get(state, '$getUserStatus.isFetching')
			|| get(state, '$permission.isFetching')
			|| get(state, '$getAppInfo.isFetching'),
		errors: [
			get(state, '$getUserStatus.error'),
			get(state, '$permission.error'),
			get(state, '$getAppInfo.error'),
		],
	};
};
const mapDispatchToProps = dispatch => ({
	checkUserStatus: () => dispatch(getUserStatus()),
	fetchPermissions: appId => dispatch(getPermission(appId)),
	fetchAppInfo: appId => dispatch(getAppInfo(appId)),
	fetchMappings: (appName, credentials) => dispatch(getAppMappings(appName, credentials)),
	handleCreatePermission: (appId, payload) => dispatch(createPermission(appId, payload)),
	handleDeletePermission: (appId, payload) => dispatch(deletePermission(appId, payload)),
	handleEditPermission: (appId, payload) => dispatch(updatePermission(appId, payload)),
	getAppCred: (appId) => dispatch(getAppCredentials(appId))
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Credentials);
