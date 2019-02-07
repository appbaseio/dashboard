import React, { Component } from 'react';
import { string, func } from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { SCALR_API } from '../../constants/config';

import {
	setCurrentApp,
	getPermission as getPermissionFromAppbase,
} from '../../batteries/modules/actions';
import { getAppPermissionsByName, getAppPlanByName } from '../../batteries/modules/selectors';

import Loader from '../../components/Loader';
import Banner from '../../batteries/components/shared/UpgradePlan/Banner';

const freePlanMessage = {
	title: 'Unlock the Promoted Results',
	description: 'Get a paid plan to enable Promoted Results.',
	buttonText: 'Upgrade Now',
	href: 'billing',
};

const paidPlanMessage = {
	title: 'Promoted Results',
	description: 'Promote and hide your results for search queries.',
	showButton: false,
};

class QueryRules extends Component {
	componentDidMount() {
		const { credentials } = this.props;
		if (!credentials) {
			this.init();
		}
	}

	componentDidUpdate(prevProps) {
		const { appName, appId } = this.props;
		if (appName !== prevProps.appName || appId !== prevProps.appId) {
			this.init();
		}
	}

	init() {
		// prettier-ignore
		const {
			updateCurrentApp,
			appName,
			appId,
			getPermission,
		} = this.props;
		updateCurrentApp(appName, appId);
		getPermission(appName);
	}

	render() {
		const { appName, credentials, plan } = this.props;
		const splitHost = SCALR_API.split('https://');
		let clusterHost = 'scalr.api.appbase.io';
		if (splitHost.length === 2) {
			[, clusterHost] = splitHost;
		}
		const dejavu = {
			url: `https://${credentials}@${clusterHost}`,
			appname: appName,
		};
		const iframeURL = `https://upbeat-kalam-f96fba.netlify.com/promoted-results-queries?appname=${
			dejavu.appname
		}&url=${
			dejavu.url
		}&footer=false&sidebar=false&appswitcher=false&mode=edit&cloneApp=false&oldBanner=false`;

		return (
			<section>
				{plan === 'free' ? (
					<Banner {...freePlanMessage} />
				) : (
					<Banner {...paidPlanMessage} />
				)}
				{credentials ? (
					<iframe
						height={`${window.innerHeight - 65}px`}
						width="100%"
						title="dejavu"
						src={iframeURL}
						frameBorder="0"
					/>
				) : (
					<Loader />
				)}
			</section>
		);
	}
}

QueryRules.propTypes = {
	appName: string.isRequired,
	appId: string.isRequired,
	credentials: string.isRequired,
	updateCurrentApp: func.isRequired,
	getPermission: func.isRequired,
};

const mapStateToProps = (state) => {
	const appPlan = getAppPlanByName(state);
	const { username, password } = get(getAppPermissionsByName(state), 'credentials', {});
	return {
		plan: get(appPlan, 'plan', 'free'),
		credentials: username ? `${username}:${password}` : '',
	};
};

const mapDispatchToProps = dispatch => ({
	updateCurrentApp: (appName, appId) => dispatch(setCurrentApp(appName, appId)),
	getPermission: appId => dispatch(getPermissionFromAppbase(appId)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(QueryRules);
