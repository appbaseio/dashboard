import React, { Component } from 'react';
import { appbaseService } from '../../service/AppbaseService';
import AppPage from '../../shared/AppPage';
import EsAlert from '../../shared/EsAlert';
import { common } from '../../shared/helper';

export default class Mirage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loadActive: true,
		};
	}

	componentWillMount() {
		this.initialize(this.props);
	}

	componentDidMount() {
		this.setPageHeight();
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.params.appId != this.appName) {
			this.initialize(nextProps);
		}
	}

	componentWillUnmount() {
		$(window).unbind('resize');
	}

	setPageHeight() {
		const setPage = () => {
			const bodyHeight = $('.ad-detail').height() - $('.ad-detail-page-header').outerHeight();
			$(this.pageRef).css('height', bodyHeight);
		};
		setTimeout(setPage, 1000);
		$(window).resize(() => {
			setTimeout(setPage, 1000);
		});
	}

	getPermission() {
		appbaseService.getPermission(this.appId).then(permission => {
			this.setState(
				{
					permission,
					loadActive: true,
					showAlert: false,
					adminPermission: common.getPermission(permission.body, 'admin'),
				},
				this.createUrl,
			);
		});
	}

	initialize(props) {
		this.appName = props.params.appId;
		this.appId = appbaseService.userInfo.body.apps[this.appName];
		this.plugin = 'mirage';
		this.setState(
			{
				[this.plugin]: null,
				loadActive: true,
			},
			this.getPermission,
		);
	}

	createUrl() {
		if (this.state.adminPermission) {
			const obj = {
				url: `https://${this.state.adminPermission.username}:${
					this.state.adminPermission.password
				}@scalr.api.appbase.io`,
				appname: this.appName,
			};
			const URL = JSON.stringify(obj);
			this.applyUrl(URL);
		} else if (this.state.permission && this.state.permission.body.length) {
			const {
				permission: {
					body: [permission],
				},
			} = this.state;
			const obj = {
				url: `https://${permission.username}:${permission.password}@scalr.api.appbase.io`,
				appname: this.appName,
			};
			const URL = JSON.stringify(obj);
			this.applyUrl(URL);
		} else if (this.state.adminPermission === null) {
			this.setState({
				showAlert: true,
				loadActive: false,
			});
		}
	}

	applyUrl(url) {
		this.setState({
			mirage: `https://opensource.appbase.io/mirage/#?app=${url}&hf=false&subscribe=false`,
		});
	}

	onIfreamLoad() {
		this.setState({
			loadActive: false,
		});
	}

	render() {
		this.pageInfo = {
			currentView: 'mirage',
			appName: this.appName,
			appId: this.appId,
		};
		return (
			<AppPage pageInfo={this.pageInfo}>
				<div className="ad-detail-page ad-dashboard row">
					<header className="ad-detail-page-header header-inline-summary header-align-end col-xs-12 hidden" />
					<div
						className="ad-detail-page-body col-xs-12"
						ref={page => {
							this.pageRef = page;
						}}
					>
						<div className="plugin-container">
							{this.state.loadActive ? <div className="loadingBar" /> : null}
							{this.state[this.plugin] ? (
								<iframe
									onLoad={() => this.onIfreamLoad()}
									title="mirage"
									src={this.state[this.plugin]}
									height="100%"
									width="100%"
									frameBorder="0"
								/>
							) : null}
							{this.state.showAlert ? <EsAlert {...this.pageInfo} /> : null}
						</div>
					</div>
				</div>
			</AppPage>
		);
	}
}
