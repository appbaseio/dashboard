import React, { Component } from 'react';
import { appbaseService } from './service/AppbaseService';

export default class Authenticator extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isReady: false,
		};
	}

	componentDidMount() {
		appbaseService
			.getUser()
			.then(() => {
				this.setState({
					isReady: true,
				});
			})
			.catch(() => {
				window.location = `${window.location.protocol}//${window.location.host}/login`;
			});
	}

	render() {
		if (!this.state.isReady) return null;
		return this.props.children;
	}
}
