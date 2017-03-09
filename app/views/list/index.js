import React, { Component } from 'react';
import { Circle } from 'rc-progress';
import { Link, browserHistory } from 'react-router';
import NewApp from './components/NewApp';
import ActionButtons from './components/ActionButtons';
import AppCard from './components/AppCard';
import { appbaseService } from '../../service/AppbaseService';
import { billingService } from '../../service/BillingService';
import { appListHelper, common } from '../../shared/helper';
import { AppOwner } from '../../shared/SharedComponents';
import SortBy from './components/SortBy';
import Upgrade from './components/Upgrade';

const moment = require('moment');

const AppIntro = (props) => {
	return (
		<AppCard {...props}>
			<h3 className="title">Hi {props.name},</h3>
			<p className="description">
				This is your dashboard. Lorem ipsum dolor sit amet, consectetur adipisicing elit. 
				Ratione et voluptas fuga accusamus minima totam sequi impedit. Natus, placeat corporis.
			</p>
		</AppCard>
	);
}

const AppTutorial = (props) => {
	return (
		<AppCard {...props}>
			<h3 className="title">Quick Links</h3>
			<ul>
				<li><a href="#">Documentation</a></li>
				<li><a href="#">Tutorial</a></li>
				<li><a href="#">Chat Support</a></li>
				<li><a href="#">Report a bug</a></li>
			</ul>
		</AppCard>
	);
}

export default class AppList extends Component {

	constructor(props) {
		super(props);
		this.state = {
			apps: [],
			plan: 'free',
			createAppLoading: false,
			createAppError: null
		};
		this.themeColor = '#CDDC39';
		this.trailColor = '#eee';
		this.createApp = this.createApp.bind(this);
		this.deleteApp = this.deleteApp.bind(this);
		this.registerApps = this.registerApps.bind(this);
	}

	componentWillMount() {
		this.stopUpdate = false;
		if(appbaseService.userInfo) {
			this.initialize();
		} else {
			browserHistory.push('/');
		}
	}

	deleteApp(app) {
		appbaseService.deleteApp(app.id).then((data) => {
			this.initialize();
		}).catch((e) => {
			console.log(e);
		});
	}

	componentWillUnmount() {
		this.stopUpdate = true;
	}

	initialize() {
		this.setSort = true;
		this.getBillingInfo();
		this.registerApps(appListHelper.normalizaApps(appbaseService.userInfo.body.apps), true);
	}

	registerApps(apps, getInfo = false) {
		this.setState({
			apps: apps
		}, (() => {
			if (getInfo) {
				this.getAppInfo.call(this)
			}
		}));
	}

	getBillingInfo() {
		if(appbaseService.userInfo && appbaseService.userInfo.body && appbaseService.userInfo.body.c_id) {
			const requestData = {
				c_id: appbaseService.userInfo.body.c_id
			};
			billingService.getCustomer(requestData).then((data) => {
				const plan = Object.keys(billingService.planLimits).indexOf(data.plan) > -1 ? data.plan : "free";
				this.setState({
					billingInfo: data,
					plan
				});
			}).catch((e) => {
				console.log(e);
			})
		}
	}

	calcPercentage(app, field) {
		let count = field === 'action' ? (app.info && app.info.appStats && app.info.appStats.calls ? app.info.appStats.calls : 0) : (app.info && app.info.appStats && app.info.appStats.records ? app.info.appStats.records : 0);
		let percentage = (100 * count) / billingService.planLimits[this.state.plan][field];
		percentage = percentage < 100 ? percentage : 100;
		return {
			percentage: percentage,
			count: count
		};
	}

	getAppInfo() {
		let apps = this.state.apps;
		appListHelper.getAll(apps).then((apps) => {
			if (this.setSort) {
				this.setSort = false;
				apps = appbaseService.applySort(apps);
				this.updateApps(apps);
			} else {
				this.updateApps(apps);
			}
		}).catch((e) => {
			console.log(e);
		});
	}

	updateApps(apps) {
		if (!this.stopUpdate) {
			this.setState({ apps: apps });
			appbaseService.setExtra("allApps", apps);
		}
	}

	createApp(appName) {
		this.setState({
			createAppLoading: true
		});
		appListHelper.createApp(appName, this.state.apps).then((data) => {
			this.setState(data);
		}).catch((e) => {
			this.setState(e);
		});
	}

	timeAgo(app) {
		return app && app.lastAciveOn ? moment(app.lastAciveOn).fromNow() : null;
	}

	renderElement(ele) {
		var generatedEle = null;
		switch (ele) {
			case 'apps':
				let apps = this.state.apps;
				generatedEle = apps.map((app, index) => {
					let appCount = {
						action: this.calcPercentage(app, 'action'),
						records: this.calcPercentage(app, 'records')
					};
					return (
						<AppCard key={app.name}>
							<div className="ad-list-app" onClick={() => browserHistory.push(`/dashboard/${app.name}`)}>
								<header className="ad-list-app-header">
									<div className="ad-list-title-container">
										<AppOwner app={app} />
										<h3 className="title">{app.name}</h3>
									</div>
									<p className="time">
										<i className="fa fa-clock-o"></i> {this.timeAgo(app) ? this.timeAgo(app) : ""}
									</p>
								</header>
								<div className="description">
									<div className="row clearfix ad-metrics-summary">
										<div className="col-xs-6">
											<div className="col-xs-12 p-0 progress-container">
												<span className="progress-wrapper">
													<Circle percent={appCount.action.percentage} strokeWidth="20" trailWidth="20" trailColor={this.trailColor} strokeColor={this.themeColor} />
												</span>
												<div className="progress-text">
													<div className="sub-title">
														Api calls
													</div>
													<div>
														<strong>{common.compressNumber(appCount.action.count)}</strong>&nbsp;/&nbsp;
														<span>{common.compressNumber(billingService.planLimits[this.state.plan].action)}</span>
													</div>
												</div>
											</div>
										</div>
										<div className="col-xs-6">
											<div className="col-xs-12 p-0 progress-container">
												<span className="progress-wrapper">
													<Circle percent={appCount.records.percentage} strokeWidth="20" trailWidth="20" trailColor={this.trailColor} strokeColor={this.themeColor} />
												</span>
												<div className="progress-text">
													<div className="sub-title">
														Records
													</div>
													<div>
														<strong>{common.compressNumber(appCount.records.count)}</strong>&nbsp;/&nbsp;
														<span>{common.compressNumber(billingService.planLimits[this.state.plan].records)}</span>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<ActionButtons app={app} deleteApp={this.deleteApp} />
							</div>
						</AppCard>
					);
				});
				break;
		}
		return generatedEle;
	}

	render() {
		return (
			<div className="ad-list">
				{
					appbaseService.userInfo ? 
					(
						<div>
							<header className="ad-list-header row">
								<div className="container">
									<AppIntro setClassName="hidden-xs" name={appbaseService.userInfo.body.details.given_name} />
									<AppTutorial setClassName="hidden-xs hidden-sm" />
									<NewApp
										createApp={this.createApp} 
										apps={this.state.apps}
										createAppLoading={this.state.createAppLoading}
										createAppError={this.state.createAppError}
										clearInput={this.state.clearInput} />
								</div>
							</header>
							<main className="ad-list-container container">
								<Upgrade apps={this.state.apps} plan={this.state.plan} />
								<div className="ad-list-filters col-xs-12 p-0 text-right">
									<SortBy apps={this.state.apps} registerApps={this.registerApps} />
								</div>
								<div className="ad-list-apps row">
									{this.renderElement('apps')}
								</div>
							</main>
						</div>
					) : null
				}
			</div>
		);
	}

}
