import React from 'react';
import { Table, Card, Button } from 'antd';
import { connect } from 'react-redux';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import Loader from '../../batteries/components/shared/Loader';
import Container from '../../components/Container';
import { getSharedApp, createAppShare, updatePermission } from '../../batteries/modules/actions';
import UpgradePlanBanner from '../../batteries/components/shared/UpgradePlan/Banner';
import CredentialsForm from '../../components/CreateCredentials';
import { getAppPlanByName } from '../../batteries/modules/selectors';

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
];
const bannerConfig = {
	title: 'Upgrade to collaborate with your team',
	description: 'Invite team members and collaborate together on your app.',
	buttonText: 'Upgrade Now',
	href: '/billing',
};

class ShareSettingsView extends React.Component {
	state = {
		showForm: false,
		selectedSettings: undefined,
	};

	componentDidMount() {
		this.getAppShare();
	}

	componentDidUpdate(prevProps) {
		const { success } = this.props;
		if (success && success !== prevProps.success) {
			this.handleCancel();
			this.getAppShare();
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
			handleEditPermission(appId, selectedSettings.username, requestPayload);
		} else {
			shareApp(appId, requestPayload);
		}
	};

	handleEdit = (setting) => {
		this.setState({
			showForm: true,
			selectedSettings: setting,
		});
	};

	render() {
		const { isPaidUser, sharedUsers, isLoading } = this.props;
		const { showForm, selectedSettings } = this.state;
		if (isLoading) {
			return <Loader />;
		}
		return (
			<Container>
				{!isPaidUser ? (
					<UpgradePlanBanner {...bannerConfig} />
				) : (
					<React.Fragment>
						<Card
							extra={(
<Button onClick={this.handleShare} size="large" type="primary">
									Share
</Button>
)}
						>
							<Table
								dataSource={sharedUsers.map(user => ({
									settingInfo: user,
									handleEdit: this.handleEdit,
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
					</React.Fragment>
				)}
			</Container>
		);
	}
}

ShareSettingsView.propTypes = {
	shareApp: PropTypes.func.isRequired,
	success: PropTypes.bool.isRequired,
	isLoading: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
	const appOwner = get(state, '$getAppInfo.app.owner');
	const userEmail = get(state, 'user.data.email');
	return {
		isPaidUser: get(getAppPlanByName(state), 'isPaid'),
		appId: get(state, '$getCurrentApp.id'),
		isOwner: appOwner === userEmail,
		isLoading: get(state, '$getSharedApp.isFetching'),
		errors: [get(state, '$getSharedApp.error')],
		sharedUsers: get(state, '$getSharedApp.results', []),
		success:
			get(state, '$createAppShare.success') || get(state, '$updateAppPermission.success'),
	};
};
const mapDispatchToProps = dispatch => ({
	fetchAppShare: appId => dispatch(getSharedApp(appId)),
	shareApp: (appId, payload) => dispatch(createAppShare(appId, payload)),
	handleEditPermission: (appId, username, payload) => dispatch(updatePermission(appId, username, payload)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ShareSettingsView);
