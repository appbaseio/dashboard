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
		};

		this.appName = props.params.appId;
		this.appId = appbaseService.userInfo.body.apps[this.appName];
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

	render() {
		this.pageInfo = {
			currentView: 'search-sandbox',
			appName: this.appName,
			appId: this.appId,
		};

		if (!this.state.credentials) {
			return 'Loading...';
		}

		return (
			<AppPage pageInfo={this.pageInfo}>
				<SearchSandbox
					appId={this.appId}
					appName={this.appName}
					credentials={this.state.credentials}
					isDashboard
				>
					{this.props.children}
				</SearchSandbox>
			</AppPage>
		);
	}
}
