import React, { Component } from 'react';
import { string, func } from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';

import {
	setCurrentApp,
	getPermission as getPermissionFromAppbase,
} from '../../batteries/modules/actions';
import { getAppPermissionsByName } from '../../batteries/modules/selectors';
// eslint-disable-next-line import/no-cycle
import SearchSandbox from '../../batteries/components/SearchSandbox';
// eslint-disable-next-line import/no-cycle
import Editor from '../../batteries/components/SearchSandbox/containers/Editor';
import Loader from '../../components/Loader';

export const AnalyticsContext = React.createContext();

class SandboxPage extends Component {
	state = { enableAnalytics: true };

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

	toggleAnalytics = () => this.setState(prevState => ({
			enableAnalytics: !prevState.enableAnalytics,
		}));

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
		const { enableAnalytics } = this.state;

		if (!credentials) {
			return <Loader />;
		}

		return (
			<AnalyticsContext.Provider
				value={{ enableAnalytics, toggleAnalytics: this.toggleAnalytics }}
			>
				<SearchSandbox
					appId={appId}
					appName={appName}
					credentials={credentials}
					isDashboard
				>
					<Editor />
				</SearchSandbox>
			</AnalyticsContext.Provider>
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
