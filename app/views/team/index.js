import React, { Component } from 'react';
import { appbaseService } from '../../service/AppbaseService';
import ShareCard from './ShareCard';
import NewShare from './NewShare';
import AppPage from '../../shared/AppPage';

export default class Team extends Component {
	constructor(props, context) {
		super(props);
		this.state = {
			info: null
		};
		this.getInfo = this.getInfo.bind(this);
		this.newShare = this.newShare.bind(this);
	}

	componentWillMount() {
		this.stopUpdate = false;
		this.initialize(this.props);
	}

	componentWillUnmount() {
		this.stopUpdate = true;
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.params.appId != this.appName) {
			this.initialize(nextProps);
		}
	}

	initialize(props) {
		this.appName = props.params.appId;
		this.appId = appbaseService.userInfo.body.apps[this.appName];
		this.getInfo();
	}

	getInfo() {
		this.info = {};
		appbaseService.getShare(this.appId).then((data) => {
			this.info.share = data;
			if(!this.stopUpdate) {
				this.setState({ info: this.info });
			}
		});
	}

	newShare(request) {
		appbaseService.newShare(this.appId, request).then((data) => {
			this.getInfo();
		});
	}

	renderElement(method) {
		let element = null;
		switch(method) {
			case 'share':
				if(this.state.info && this.state.info.share) {
					element = this.state.info.share.body.map((shareInfo, index) => {
						return (
							<ShareCard
								appId={this.appId}
								key={index}
								shareInfo={shareInfo}
								getInfo={this.getInfo}
							/>
						);
					})
				}
			break;
		}
		return element;
	}

	render() {
		return (
			<AppPage
				pageInfo={{
					currentView: 'team',
					appName: this.appName,
					appId: this.appId
				}}
			>
				<div className="ad-detail-page ad-dashboard row">
					<header className="ad-detail-page-header col-xs-12">
						<h2 className="ad-detail-page-title">Team</h2>
						<aside className="ad-detail-page-header-sidebar col-xs-12 col-sm-6">
							<NewShare newShare={this.newShare} />
						</aside>
					</header>
					<main className="ad-detail-page-body col-xs-12">
						<div className="page-body col-xs-12">
							<section className="ad-detail-page-body-card">
								<header className="ad-detail-page-body-card-title with-border">
									Team Members
								</header>
								<main className="ad-detail-page-body-card-body row">
									{this.renderElement('share')}
								</main>
							</section>
						</div>
					</main>
				</div>
			</AppPage>
		);
	}
}
