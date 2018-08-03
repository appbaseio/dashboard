import React, { Component } from 'react';
import { appbaseService } from '../../service/AppbaseService';
import ShareCard from './ShareCard';
import NewShare from './NewShare';
import AppPage from '../../shared/AppPage';
import { checkUserStatus } from './../../../modules/batteries/utils';
import TransferOwnership from './TransferOwnership';
import UpgradePlan from './../../shared/UpgradePlan';

const InitialShare = () => (
	<p className="col-xs-12 ad-initial-share">You do not have any team members yet.</p>
);

const ShareOwner = props => (
	<p className="share-owner">This app has been shared by {props.owner}.</p>
);

const bannerConfig = {
	title: 'Upgrade to collaborate with your team',
	description: 'Invite team members and collaborate together on your app.',
	buttonText: 'Upgrade Now',
	href: '/billing',
};
export default class Team extends Component {
	constructor(props) {
		super(props);
		this.state = {
			info: null,
			newShareExpand: false,
			isPaidUser: false,
		};
		this.getInfo = this.getInfo.bind(this);
		this.newShare = this.newShare.bind(this);
		this.newShareInit = this.newShareInit.bind(this);
	}

	componentWillMount() {
		this.stopUpdate = false;
		this.initialize(this.props);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.params.appId !== this.appName) {
			this.initialize(nextProps);
		}
	}
	componentWillUnmount() {
		this.stopUpdate = true;
	}
	getInfo() {
		checkUserStatus().then((res) => {
			this.setState(
				{
					isPaidUser: res.isPaidUser,
				},
				() => {
					if (this.state.isPaidUser) {
						this.info = {};

						appbaseService.getShare(this.appId).then((data) => {
							this.info.share = data;
							if (!this.stopUpdate) {
								this.setState({ info: this.info });
							}
						});
						appbaseService.getAppInfo(this.appId).then((data) => {
							this.info.appInfo = data.body;
							if (!this.stopUpdate) {
								this.setState({ info: this.info });
							}
						});
					}
				},
			);
		});
	}
	initialize(props) {
		this.appName = props.params.appId;
		this.appId = appbaseService.userInfo.body.apps[this.appName];
		this.getInfo();
	}

	newShareInit() {
		this.setState({
			newShareExpand: true,
		});
	}

	newShare(request) {
		appbaseService.newShare(this.appId, request).then(() => {
			this.getInfo();
		});
	}

	renderElement(method) {
		let element = null;
		switch (method) {
			case 'share':
				if (this.state.info && this.state.info.share) {
					if (this.state.info.share.body.length) {
						element = this.state.info.share.body.map((shareInfo, index) => (
							<ShareCard
								appId={this.appId}
								key={index}
								shareInfo={shareInfo}
								getInfo={this.getInfo}
							/>
						));
					} else {
						element = (
							<InitialShare info={this.state.info} newShareInit={this.newShareInit} />
						);
					}
				}
				break;
			default:
		}
		return element;
	}

	render() {
		const { isPaidUser } = this.state;
		return (
			<AppPage
				pageInfo={{
					currentView: 'team',
					appName: this.appName,
					appId: this.appId,
				}}
			>
				<div className="ad-detail-page row" id="team-page">
					<div className="ad-detail-page-body col-xs-12">
						{!isPaidUser ? (
							<UpgradePlan {...bannerConfig} />
						) : (
							<div className="page-body col-xs-12">
								{this.state.info &&
								this.state.info.appInfo &&
								this.state.info.appInfo.owner ===
									appbaseService.userInfo.body.email ? (
									<section className="ad-detail-page-body-card col-xs-12 p-0">
										<header className="ad-detail-page-body-card-title with-border">
											<span>Team Members</span>
											<span className="pull-right">
												<TransferOwnership
													appId={this.appId}
													appName={this.appName}
												/>
											</span>
										</header>
										<div className="ad-detail-page-body-card-body col-xs-12 p-0">
											{this.renderElement('share')}
										</div>
										<div className="add-team-member-card">
											{this.state.info &&
											this.state.info.appInfo &&
											this.state.info.appInfo.owner !==
												appbaseService.userInfo.body.email ? (
												<ShareOwner owner={this.state.info.appInfo.owner} />
											) : null}
											{appbaseService.isMyApp(this.state.info) ? (
												<NewShare
													newShare={this.newShare}
													newShareExpand={this.state.newShareExpand}
												/>
											) : null}
										</div>
									</section>
								) : null}
							</div>
						)}
					</div>
				</div>
			</AppPage>
		);
	}
}
