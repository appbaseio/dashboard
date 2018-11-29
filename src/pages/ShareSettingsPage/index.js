import React from 'react';
import {
 Table, Card, Button, Popconfirm,
} from 'antd';
import { connect } from 'react-redux';
import { css } from 'react-emotion';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import Loader from '../../batteries/components/shared/Loader';
import Flex from '../../batteries/components/shared/Flex';
import { media } from '../../utils/media';
import Container from '../../components/Container';
import {
	getSharedApp,
	createAppShare,
	updatePermission,
	deleteAppShare,
} from '../../batteries/modules/actions';
import UpgradePlanBanner from '../../batteries/components/shared/UpgradePlan/Banner';
import CredentialsForm from '../../components/CreateCredentials';
import TransferOwnership from './TransferOwnership';
import { getAppPlanByName, getAppInfoByName } from '../../batteries/modules/selectors';
import { displayErrors } from '../../utils/helper';

const DeleteIcon = require('react-feather/dist/icons/trash-2').default;

const bannerMessagesTeam = {
	free: {
		title: 'Sharing Settings',
		description: 'Invite team members and collaborate together on your app.',
		buttonText: 'Upgrade Now',
		href: '/billing',
	},
	bootstrap: {
		title: 'Sharing Settings',
		description: 'Invite team members and collaborate together on your app.',
		showButton: false,
	},
	growth: {
		title: 'Sharing Settings',
		description: 'Invite team members and collaborate together on your app.',
		showButton: false,
	},
};

let lastIndex = 0;
const updateIndex = () => {
	lastIndex += 1;
	return lastIndex;
};

const columns = [
	{
		title: 'Team Members',
		render: ({ settingInfo }) => settingInfo.email,
		key: `email${updateIndex()}`,
	},
	{
		title: 'Access',
		render: ({ settingInfo }) => settingInfo.description || 'No description',
		key: `description${updateIndex()}`,
	},
	{
		title: 'Edit',
		// eslint-disable-next-line
		render: ({ settingInfo, handleEdit }) => (
			<Button
				onClick={() => handleEdit(settingInfo)}
				style={{ border: 'none' }}
				icon="setting"
			/>
		),
		key: `edit${updateIndex()}`,
	},
	{
		title: 'Delete',
		// eslint-disable-next-line
		render: ({ settingInfo, handleDelete }) => (
			<Popconfirm
				placement="leftTop"
				title={`Are you sure to unshare this app with ${settingInfo.email}?`}
				onConfirm={() => handleDelete(settingInfo.username, {
						email: settingInfo.email,
					})
				}
				okText="Yes"
				cancelText="No"
			>
				<Button type="danger" size="default">
					<DeleteIcon size={16} />
				</Button>
			</Popconfirm>
		),
		key: `edit${updateIndex()}`,
	},
];

class ShareSettingsView extends React.Component {
	state = {
		showForm: false,
		selectedSettings: undefined,
	};

	componentDidMount() {
		this.getAppShare();
	}

	componentDidUpdate(prevProps) {
		const { errors, transferSuccess } = this.props;
		displayErrors(errors, prevProps.errors);
		if (transferSuccess && transferSuccess !== prevProps.transferSuccess) {
			// Redirect to home
			window.location = window.origin;
		}
	}

	getAppShare() {
		const { fetchAppShare, appId } = this.props;
		fetchAppShare(appId);
	}

	handleShare = () => {
		this.setState({
			showForm: true,
		});
	};

	handleCancel = () => {
		this.setState({
			showForm: false,
			selectedSettings: undefined,
		});
	};

	handleSubmit = (form) => {
		const { appId, shareApp, handleEditPermission } = this.props;
		const { selectedSettings } = this.state;
		const requestPayload = { ...form.value.operationType, ...form.value };
		delete requestPayload.operationType;
		if (selectedSettings && selectedSettings.username) {
			handleEditPermission(appId, selectedSettings.username, requestPayload).then(
				({ payload }) => {
					if (payload) {
						this.afterSuccess();
					}
				},
			);
		} else {
			shareApp(appId, requestPayload).then(({ payload }) => {
				if (payload) {
					this.afterSuccess();
				}
			});
		}
	};

	handleEdit = (setting) => {
		this.setState({
			showForm: true,
			selectedSettings: setting,
		});
	};

	handleDelete = (username, body) => {
		const { deleteShareApp } = this.props;
		deleteShareApp(username, body).then(({ payload }) => {
			if (payload) {
				this.getAppShare();
			}
		});
	};

	afterSuccess() {
		this.handleCancel();
		this.getAppShare();
	}

	render() {
		const {
 isPaidUser, sharedUsers, isLoading, isOwner, isDeleting, plan,
} = this.props;
		const { showForm, selectedSettings } = this.state;
		if (isLoading && !(sharedUsers && sharedUsers.length)) {
			return <Loader />;
		}
		if (!isPaidUser) {
			return <UpgradePlanBanner {...bannerMessagesTeam.free} />;
		}
		return (
			<React.Fragment>
				<UpgradePlanBanner {...bannerMessagesTeam[plan]} />
				<Container>
					{isOwner && (
						<Flex
							justifyContent="flex-end"
							css={`
								${media.small(
									css`
										justify-content: center;
									`,
								)};
							`}
							style={{
								paddingBottom: '20px',
							}}
						>
							<TransferOwnership />
						</Flex>
					)}
					<Card
						css=".ant-card-head-title { margin-top: 10px }"
						title="Share Credentials"
						extra={(
<Button onClick={this.handleShare} size="large" type="primary">
								Share
</Button>
)}
					>
						<Table
							scroll={{ x: 700 }}
							dataSource={sharedUsers.map(user => ({
								settingInfo: user,
								handleEdit: this.handleEdit,
								handleDelete: this.handleDelete,
							}))}
							rowKey={row => `${get(row, 'settingInfo.username')}:${get(
									row,
									'settingInfo.password',
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
					{showForm && (
						<CredentialsForm
							handleCancel={this.handleCancel}
							shouldHaveEmailField
							show={showForm}
							saveButtonText={!selectedSettings ? 'Share Credential' : undefined}
							onSubmit={this.handleSubmit}
							initialValues={selectedSettings}
							titleText={!selectedSettings ? 'Share' : undefined}
						/>
					)}
				</Container>
			</React.Fragment>
		);
	}
}

ShareSettingsView.propTypes = {
	shareApp: PropTypes.func.isRequired,
	deleteShareApp: PropTypes.func.isRequired,
	success: PropTypes.bool.isRequired,
	plan: PropTypes.string.isRequired,
	transferSuccess: PropTypes.bool.isRequired,
	isLoading: PropTypes.bool.isRequired,
	isDeleting: PropTypes.bool.isRequired,
	errors: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => {
	const userEmail = get(state, 'user.data.email');
	const appOwner = get(getAppInfoByName(state), 'owner');
	const planState = getAppPlanByName(state);
	return {
		isPaidUser: get(planState, 'isPaid'),
		plan: get(planState, 'plan'),
		appId: get(state, '$getCurrentApp.id'),
		isOwner: appOwner === userEmail,
		isLoading: get(state, '$getSharedApp.isFetching'),
		isDeleting: get(state, '$deleteAppShare.isFetching'),
		errors: [
			get(state, '$getSharedApp.error'),
			get(state, '$transferAppOwnership.error'),
			get(state, '$deleteAppShare.error'),
		],
		sharedUsers: get(state, '$getSharedApp.results', []),
		transferSuccess: get(state, '$transferAppOwnership.success'),
		success:
			get(state, '$createAppShare.success') || get(state, '$updateAppPermission.success'),
	};
};
const mapDispatchToProps = dispatch => ({
	fetchAppShare: appId => dispatch(getSharedApp(appId)),
	shareApp: (appId, payload) => dispatch(createAppShare(appId, payload)),
	deleteShareApp: (username, payload) => dispatch(deleteAppShare(username, payload)),
	handleEditPermission: (appId, username, payload) => dispatch(updatePermission(appId, username, payload)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ShareSettingsView);
