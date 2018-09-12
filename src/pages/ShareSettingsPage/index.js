import React from 'react';
import { Table, Card, Button } from 'antd';
import { connect } from 'react-redux';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import Container from '../../components/Container';
import { getSharedApp, createAppShare } from '../../batteries/modules/actions';
import ButtonBtr from '../../batteries/components/shared/Button/Primary';
import UpgradePlanBanner from '../../batteries/components/shared/UpgradePlan/Banner';
import CredentialsForm from '../../components/CreateCredentials';

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
		if (success !== prevProps.success) {
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
		const { appId, shareApp } = this.props;
		const requestPayload = { ...form.value.operationType, ...form.value };
		delete requestPayload.operationType;
		console.log(JSON.stringify(requestPayload));
		shareApp(appId, requestPayload);
	};

	handleEdit = (setting) => {
		this.setState({
			showForm: true,
			selectedSettings: setting,
		});
	};

	render() {
		const { isPaidUser, sharedUsers } = this.props;
		const { showForm, selectedSettings } = this.state;
		return (
			<Container>
				{!isPaidUser ? (
					<UpgradePlanBanner {...bannerConfig} />
				) : (
					<React.Fragment>
						<Card extra={<ButtonBtr onClick={this.handleShare}>Share</ButtonBtr>}>
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
	checkUserStatus: PropTypes.func.isRequired,
	shareApp: PropTypes.func.isRequired,
	success: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
	const appOwner = get(state, '$getAppInfo.app.owner');
	const userEmail = get(state, 'user.data.email');
	return {
		isPaidUser: get(state, '$getAppPlan.isPaid'),
		appId: get(state, '$getCurrentApp.id'),
		isOwner: appOwner === userEmail,
		isLoading:
			get(state, '$getAppPermissions.isFetching') || get(state, '$getAppInfo.isFetching'),
		errors: [get(state, '$getSharedApp.error')],
		sharedUsers: get(state, '$getSharedApp.results', []),
		success: get(state, '$createAppShare.success'),
	};
};
const mapDispatchToProps = dispatch => ({
	fetchAppShare: appId => dispatch(getSharedApp(appId)),
	shareApp: (appId, payload) => dispatch(createAppShare(appId, payload)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ShareSettingsView);
