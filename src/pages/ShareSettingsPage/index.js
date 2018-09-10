import React from 'react';
import { Table, Card } from 'antd';
import { connect } from 'react-redux';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import Container from '../../components/Container';
import EditSettings from './EditSettings';
import { getSharedApp } from '../../batteries/modules/actions';
import UpgradePlanBanner from '../../batteries/components/shared/UpgradePlan/Banner';

const columns = [
	{
		title: 'Team Members',
		dataIndex: 'email',
	},
	{
		title: 'Access',
		dataIndex: 'description',
	},
	{
		title: 'Edit',
		render: setting => <EditSettings setting={setting} />,
	},
];
const bannerConfig = {
	title: 'Upgrade to collaborate with your team',
	description: 'Invite team members and collaborate together on your app.',
	buttonText: 'Upgrade Now',
	href: '/billing',
};

class ShareSettingsView extends React.Component {
	componentDidMount() {
		const { fetchAppShare, appId } = this.props;
		fetchAppShare(appId);
	}

	render() {
		const { isPaidUser, sharedUsers } = this.props;
		console.log(sharedUsers);
		return (
			<Container>
				{!isPaidUser ? (
					<UpgradePlanBanner {...bannerConfig} />
				) : (
					<Card>
						<Table
							rowKey={item => item.email}
							columns={columns}
							dataSource={sharedUsers}
							css="tr:hover td {
								background: transparent;
							}"
						/>
					</Card>
				)}
			</Container>
		);
	}
}

ShareSettingsView.propTypes = {
	checkUserStatus: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
	const appOwner = get(state, '$getAppInfo.app.owner');
	const userEmail = get(state, 'user.data.email');
	return {
		isPaidUser: get(state, '$getUserStatus.isPaidUser'),
		appId: get(state, '$getCurrentApp.id'),
		isOwner: appOwner === userEmail,
		isLoading:
			get(state, '$getUserStatus.isFetching')
			|| get(state, '$getAppPermissions.isFetching')
			|| get(state, '$getAppInfo.isFetching'),
		errors: [get(state, '$getSharedApp.error')],
		sharedUsers: get(state, '$getSharedApp.results'),
	};
};
const mapDispatchToProps = dispatch => ({
	fetchAppShare: appId => dispatch(getSharedApp(appId)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ShareSettingsView);
