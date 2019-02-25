import React, { Component } from 'react';
import { string, func } from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { SCALR_API } from '../../constants/config';

import {
	setCurrentApp,
	getPermission as getPermissionFromAppbase,
} from '../../batteries/modules/actions';
import { getAppPermissionsByName } from '../../batteries/modules/selectors';

import Loader from '../../components/Loader';
import Frame from '../../components/Frame';

class BrowserPage extends Component {
	state = {
		isFrameLoading: true,
	};

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

	frameLoaded = () => {
		this.setState({
			isFrameLoading: false,
		});
	};

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
		const { isFrameLoading } = this.state;
		const splitHost = SCALR_API.split('https://');
		let clusterHost = 'scalr.api.appbase.io';
		if (splitHost.length === 2) {
			[, clusterHost] = splitHost;
		}
		const dejavu = {
			url: `https://${credentials}@${clusterHost}`,
			appname: appName,
		};
		const iframeURL = `https://dejavu.appbase.io/?appname=${dejavu.appname}&url=${
			dejavu.url
		}&footer=false&sidebar=false&appswitcher=false&mode=edit&cloneApp=false&oldBanner=false`;

		return (
			<section>
				{isFrameLoading && <Loader />}
				{credentials ? (
					<Frame
						height={`${window.innerHeight - 65}px`}
						width="100%"
						id="dejavu"
						src={iframeURL}
						frameBorder="0"
						onLoad={this.frameLoaded}
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
