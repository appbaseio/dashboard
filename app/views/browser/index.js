import React, { Component } from 'react';
import { Link } from 'react-router';
import { appbaseService } from '../../service/AppbaseService';
import { urlShare } from '../../service/tutorialService/UrlShare';
import AppPage from '../../shared/AppPage';
const $ = require('jquery');

export default class Browser extends Component {

	constructor(props) {
		super(props);
		this.state = {
			loadActive: true
		};
	}

	componentWillMount() {
		this.initialize(this.props);
	}

	componentDidMount() {
		this.setPageHeight();
	}

	componentWillUnmount() {
		$(window).unbind("resize");
	}

	setPageHeight() {
		const setPage = () => {
			const bodyHeight = $('.ad-detail').height() - $('.ad-detail-page-header').outerHeight();
			$(this.pageRef).css('height', bodyHeight);
		}
		setTimeout(setPage, 1000);
		$(window).resize(() => {
			setTimeout(setPage, 1000);
		});
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
			[this.plugin]: null,
			loadActive: true
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

	onIfreamLoad() {
		this.setState({
			loadActive: false
		});
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
				<div className="ad-detail-page ad-dashboard row">
						<header className="ad-detail-page-header header-inline-summary header-align-end col-xs-12">
							<h2 className="ad-detail-page-title">Data Browser</h2>
							<p>
								Check the app data over here.
							</p>
						</header>
						<main className='ad-detail-page-body col-xs-12' ref={(page) => this.pageRef = page}>
							<div className="plugin-container">
								{this.state.loadActive ? (<div className="loadingBar"></div>) : null}
								{
									this.state[this.plugin] ? (
										<iframe onLoad={() => this.onIfreamLoad()} src={this.state[this.plugin]} height="100%" width="100%" frameBorder="0"></iframe>
									) : null
								}
							</div>
						</main>
				</div>
			</AppPage>
		);
	}

}
