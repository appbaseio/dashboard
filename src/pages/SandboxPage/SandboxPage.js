import React, { Component } from 'react';
import { string, func } from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';

import {
	setCurrentApp,
	getPermission as getPermissionFromAppbase,
} from '../../batteries/modules/actions';
import { getAppPermissionsByName } from '../../batteries/modules/selectors';
import SearchSandbox from '../../batteries/components/SearchSandbox';
import Editor from '../../batteries/components/SearchSandbox/containers/Editor';
import Loader from '../../components/Loader';

class SandboxPage extends Component {
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
		const { appId, appName, credentials } = this.props;

		if (!credentials) {
			return <Loader />;
		}

		return (
			<SearchSandbox appId={appId} appName={appName} credentials={credentials} isDashboard>
				<Editor />
			</SearchSandbox>
		);
	}
}

SandboxPage.propTypes = {
	appName: string.isRequired,
	appId: string.isRequired,
	credentials: string, // eslint-disable-line
	updateCurrentApp: func.isRequired,
	getPermission: func.isRequired,
};

const mapStateToProps = (state) => {
	const { username, password } = get(getAppPermissionsByName(state), 'credentials', {});
	return {
		credentials: username ? `${username}:${password}` : null,
	};
};

const mapDispatchToProps = dispatch => ({
	updateCurrentApp: (appName, appId) => dispatch(setCurrentApp(appName, appId)),
	getPermission: appId => dispatch(getPermissionFromAppbase(appId)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(SandboxPage);
