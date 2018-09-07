import React from 'react';
import { Table } from 'antd';
import { connect } from 'react-redux';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import Container from '../../components/Container';
import {
	getUserStatus,
} from '../../batteries/modules/actions';
import UpgradePlanBanner from './../../batteries/components/shared/UpgradePlan/Banner';

const columns = [
	{
		title: 'Team Members',
		key: 'description',
	},
	{
		title: 'Access',
		key: 'credentials',
    },
    {
		title: 'Edit',
		key: 'credentialss',
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
        const { checkUserStatus } = this.props;
        checkUserStatus();
    }
    render() {
        console.log("THSI IS PROPS", this.props)
        const { isPaidUser } = this.props;
        return (<Container>
            {
                !isPaidUser ? <UpgradePlanBanner {...bannerConfig}/> : <Table columns={columns} dataSource={[]}/>
            }
            </Container>)
    }
}

ShareSettingsView.propTypes = {
    checkUserStatus: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
	const appOwner = get(state, '$getAppInfo.app.owner');
	const userEmail = get(state, 'user.data.email');
	return {
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
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ShareSettingsView);
