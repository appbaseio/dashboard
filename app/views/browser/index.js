import React, { Component } from 'react';
import { Link } from 'react-router';
import { render } from 'react-dom';
import { appbaseService } from '../../service/AppbaseService';
import { urlShare } from '../../service/tutorialService/UrlShare';
import { Loading } from '../../shared/Loading';
import AppPage from '../../shared/AppPage';

export default class Browser extends Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	componentWillMount() {
		this.initialize(this.props);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.params.appId != this.appName) {
			this.initialize(nextProps);
		}
	}

	initialize(props) {
		this.appName = props.params.appId;
		this.appId = appbaseService.userInfo.body.apps[this.appName];
		this.plugin = 'dejavu';
		this.setState({
			[this.plugin]: null
		}, this.getPermission);
	}

	getPermission() {
		appbaseService.getPermission(this.appId).then((data) => {
			this.setState({ permission: data }, this.createUrl);
		});
	}

	createUrl() {
		this.permission = this.state.permission;
		let obj = {
			url: 'https://' + this.permission.body[0].username + ':' + this.permission.body[0].password + '@scalr.api.appbase.io',
			appname: this.appName
		};
		urlShare.compressInputState(obj).then((url) => {
			this.applyUrl(url);
		}).catch((error) => console.log(error));
	}

	applyUrl(url) {
		this.setState({
			gem: 'https://opensource.appbase.io/gem/#?input_state=' + url + '&h=false&subscribe=false',
			dejavu: 'https://opensource.appbase.io/dejavu/live/#?input_state=' + url + '&hf=false&subscribe=false',
			mirage: 'https://opensource.appbase.io/mirage/#?input_state=' + url + '&h=false&subscribe=false'
		});
	}

	renderElement(ele) {
		let generatedEle = null;
		switch (ele) {
			case 'iframe':
				if (this.state[this.plugin]) {
					generatedEle = (<iframe src={this.state[this.plugin]} height="100%" width="100%" frameBorder="0"></iframe>);
				} else {
					generatedEle = (<div className="loadingBar"></div>);
				}
				break;
		}
		return generatedEle;
	}

	render() {
		return (
			<AppPage
				pageInfo={{
					currentView: 'browser',
					appName: this.appName,
					appId: this.appId
				}}
			>
				<div className="plugin-container">
					{this.renderElement('iframe')}
				</div>
			</AppPage>
		);
	}

}
