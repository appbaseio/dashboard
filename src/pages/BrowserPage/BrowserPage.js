import React, { Component } from 'react';
import { string, func } from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';
import Loadable from 'react-loadable';
import { SCALR_API } from '../../constants/config';

import {
	setCurrentApp,
	getPermission as getPermissionFromAppbase,
} from '../../batteries/modules/actions';
import { getAppPermissionsByName } from '../../batteries/modules/selectors';

import Loader from '../../components/Loader';

const DejavuComponent = Loadable({
	loader: () => import('dejavu-data-browser'),
	loading: Loader,
});

class BrowserPage extends Component {
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
		const { appName, credentials } = this.props;
		let clusterHost = 'scalr.api.appbase.io';
		const splitHost = SCALR_API.split('https://');
		if (splitHost.length === 2) {
			[, clusterHost] = splitHost;
		}
		const dejavu = {
			url: `https://${credentials}@${clusterHost}`,
			appname: appName,
		};
		return (
			<section style={{ backgroundColor: '#ffffff' }}>
				{credentials ? (
					<div style={{ padding: '10px' }}>
						<DejavuComponent
							app={dejavu.appname}
							url={dejavu.url}
							credentials={credentials}
							URLParams={false}
							showHeaders={false}
						/>
					</div>
				) : (
					<Loader />
				)}
			</section>
		);
	}
}

BrowserPage.propTypes = {
	appName: string.isRequired,
	appId: string.isRequired,
	credentials: string.isRequired,
	updateCurrentApp: func.isRequired,
	getPermission: func.isRequired,
};

const mapStateToProps = state => {
	const { username, password } = get(getAppPermissionsByName(state), 'credentials', {});
	return {
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
)(BrowserPage);
