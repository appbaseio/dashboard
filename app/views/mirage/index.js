import React, { Component } from 'react';
import { Link } from 'react-router';
import { appbaseService } from '../../service/AppbaseService';
import { urlShare } from '../../service/tutorialService/UrlShare';
import AppPage from '../../shared/AppPage';
import EsAlert from '../../shared/EsAlert';
import { common } from '../../shared/helper';

const $ = require('jquery');

export default class Mirage extends Component {

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
		this.plugin = 'mirage';
		this.setState({
			[this.plugin]: null,
			loadActive: true
		}, this.getPermission);
	}

	getPermission() {
		appbaseService.getPermission(this.appId).then((permission) => {
			this.setState({ 
				permission,
				loadActive: true,
				showAlert: false,
				adminPermission: common.getPermission(permission.body, "admin")
			}, this.createUrl);
		});
	}

	createUrl() {
		if(this.state.adminPermission) {
			let obj = {
				url: 'https://' + this.state.adminPermission.username + ':' + this.state.adminPermission.password + '@scalr.api.appbase.io',
				appname: this.appName
			};
			urlShare.compressInputState(obj).then((url) => {
				this.applyUrl(url);
			}).catch((error) => console.log(error));
		} else if(this.state.adminPermission === null) {
			this.setState({
				showAlert: true,
				loadActive: false
			});
		}
	}

	applyUrl(url) {
		this.setState({
			mirage: 'https://opensource.appbase.io/mirage/#?input_state=' + url + '&hf=false&subscribe=false'
		});
	}

	onIfreamLoad() {
		this.setState({
			loadActive: false
		});
	}

	render() {
		this.pageInfo = {
			currentView: 'mirage',
			appName: this.appName,
			appId: this.appId
		};
		return (
			<AppPage
				pageInfo={this.pageInfo}
			>
				<div className="ad-detail-page ad-dashboard row">
						<header className="ad-detail-page-header header-inline-summary header-align-end col-xs-12 hidden">
						</header>
						<main className='ad-detail-page-body col-xs-12' ref={(page) => this.pageRef = page}>
							<div className="plugin-container">
								{this.state.loadActive ? (<div className="loadingBar"></div>) : null}
								{
									this.state[this.plugin] ? (
										<iframe onLoad={() => this.onIfreamLoad()} src={this.state[this.plugin]} height="100%" width="100%" frameBorder="0"></iframe>
									) : null
								}
								{this.state.showAlert ? (<EsAlert {...this.pageInfo} ></EsAlert>) : null}
							</div>
						</main>
				</div>
			</AppPage>
		);
	}

}
