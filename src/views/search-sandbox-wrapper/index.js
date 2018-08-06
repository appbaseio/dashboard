import React, { Component } from 'react';
import AppPage from '../../shared/AppPage';
import SearchSandbox from '../../../modules/batteries/components/SearchSandbox';
import { appbaseService } from '../../service/AppbaseService';
import { getCredentials } from '../../../modules/batteries/utils';

export default class SearchSandboxWrapper extends Component {
	constructor(props) {
		super(props);

		this.state = {
			credentials: null,
			appName: props.params.appId,
		};

		this.appId = appbaseService.userInfo.body.apps[this.state.appName];
	}

	componentDidMount() {
		getCredentials(this.appId)
			.then((user) => {
				const { username, password } = user;
				this.setState({
					credentials: `${username}:${password}`,
				});
			})
			.catch(() => {});
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.params.appId && nextProps.params.appId !== this.state.appName) {
			this.initialize(nextProps.params.appId);
		}
	}

	initialize = (appName) => {
		this.appId = appbaseService.userInfo.body.apps[appName];
		getCredentials(this.appId)
			.then((user) => {
				const { username, password } = user;
				this.setState({
					credentials: `${username}:${password}`,
					appName,
				});
			})
			.catch(() => {});
	}

	render() {
		this.pageInfo = {
			currentView: 'search-sandbox',
			appName: this.state.appName,
			appId: this.appId,
		};

		if (!this.state.credentials) {
			return 'Loading...';
		}

		return (
			<AppPage pageInfo={this.pageInfo}>
				<SearchSandbox
					key={this.state.appName}
					appId={this.appId}
					appName={this.state.appName}
					credentials={this.state.credentials}
					isDashboard
				>
					{this.props.children}
				</SearchSandbox>
			</AppPage>
		);
	}
}
