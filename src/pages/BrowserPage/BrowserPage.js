import React, { Component, Fragment } from 'react';
import { string, func } from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';

import {
	setCurrentApp,
	getPermission as getPermissionFromAppbase,
} from '../../batteries/modules/actions';
import { getAppPermissionsByName } from '../../batteries/modules/selectors';

import Loader from '../../components/Loader';

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

		const dejavu = {
			url: `https://${credentials}@scalr.api.appbase.io`,
			appname: appName,
		};
		const url = JSON.stringify(dejavu);
		const iframeURL = `https://opensource.appbase.io/dejavu/live/#?app=${url}&hf=false&subscribe=false`;

		return (
			<section>
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

BrowserPage.propTypes = {
	appName: string.isRequired,
	appId: string.isRequired,
	credentials: string.isRequired,
	updateCurrentApp: func.isRequired,
	getPermission: func.isRequired,
};

const mapStateToProps = (state) => {
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
