import React, { Component } from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
	getAppInfo,
	setCurrentApp,
	getAppPlan,
	getUserPlan,
} from '../../batteries/modules/actions';
import {
	getAppInfoByName,
	getAppPlanByName,
} from '../../batteries/modules/selectors';
import Loader from '../Loader';
import { displayErrors } from '../../utils/helper';

class AppPageContainer extends Component {
	constructor(props) {
		super(props);

		const { appName, appId, updateCurrentApp } = props;
		if (appName && appId) {
			updateCurrentApp(appName, appId);
		}
	}

	componentDidMount() {
		// Fetch some common api calls
		const {
			appId,
			appName,
			fetchAppInfo,
			fetchAppPlan,
			fetchUserPlan,
			shouldFetchUserPlan,
			shouldFetchAppInfo,
			shouldFetchAppPlan,
			isAppPlanFetched,
			isAppInfoPresent,
			isUserPlanFetched,
		} = this.props;
		if (shouldFetchAppInfo && !isAppInfoPresent) {
			fetchAppInfo(appName);
		}
		if (shouldFetchAppPlan && !isAppPlanFetched) {
			fetchAppPlan(appName);
		}
		if (shouldFetchUserPlan && !isUserPlanFetched) {
			fetchUserPlan();
		}
	}

	componentDidUpdate(prevProps) {
		const { errors } = this.props;
		displayErrors(errors, prevProps.errors);
	}

	render() {
		const { isLoading, component, ...props } = this.props;

		if (isLoading) {
			return <Loader />;
		}

		return (
			<div key={props.appName}>
				{React.createElement(component, props)}
			</div>
		);
	}
}

AppPageContainer.defaultProps = {
	isLoading: false,
	errors: [],
	shouldFetchAppInfo: true,
	shouldFetchAppPlan: true,
	shouldFetchUserPlan: true,
};

AppPageContainer.propTypes = {
	appName: PropTypes.string.isRequired,
	appId: PropTypes.string.isRequired,
	isLoading: PropTypes.bool,
	errors: PropTypes.array,
	shouldFetchAppPlan: PropTypes.bool,
	shouldFetchAppInfo: PropTypes.bool,
	shouldFetchUserPlan: PropTypes.bool,
	component: PropTypes.func.isRequired,
	fetchAppInfo: PropTypes.func.isRequired,
	fetchAppPlan: PropTypes.func.isRequired,
	fetchUserPlan: PropTypes.func.isRequired,
	updateCurrentApp: PropTypes.func.isRequired,
	isAppPlanFetched: PropTypes.bool.isRequired,
	isAppInfoPresent: PropTypes.bool.isRequired,
	isUserPlanFetched: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, ownProps) => {
	const appName = get(ownProps, 'match.params.appName');
	return {
		appName,
		appId: get(state, 'apps', {})[appName],
		isLoading:
			get(state, '$getAppInfo.isFetching') ||
			get(state, '$getAppPlan.isFetching') ||
			get(state, '$getUserPlan.isFetching'),
		isAppPlanFetched: !!getAppPlanByName(state),
		isUserPlanFetched: !!get(state, '$getUserPlan.results'),
		isAppInfoPresent: !!getAppInfoByName(state),
		errors: [
			ownProps.shouldFetchAppInfo !== false &&
				get(state, '$getAppInfo.error'),
			ownProps.shouldFetchAppPlan !== false &&
				get(state, '$getAppPlan.error'),
			ownProps.shouldFetchUserPlan !== false &&
				get(state, '$getUserPlan.error'),
		],
	};
};

const mapDispatchToProps = dispatch => ({
	fetchAppInfo: appId => dispatch(getAppInfo(appId)),
	fetchAppPlan: appName => dispatch(getAppPlan(appName)),
	fetchUserPlan: () => dispatch(getUserPlan()),
	updateCurrentApp: (appName, appId) =>
		dispatch(setCurrentApp(appName, appId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppPageContainer);
