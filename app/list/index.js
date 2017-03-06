import React, { Component } from 'react';
import { Circle } from 'rc-progress';
import { render } from 'react-dom';
import { Link, browserHistory } from 'react-router';
import NewApp from './components/NewApp';
import ActionButtons from './components/ActionButtons';
import AppCard from './components/AppCard';
import { appbaseService } from '../service/AppbaseService';
import { appListHelper, comman } from '../shared/helper';

const moment = require('moment');

const AppIntro = (props) => {
	return (
		<AppCard>
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
		<AppCard>
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
		this.initialize();
	}

	deleteApp(app) {
		appbaseService.deleteApp(app.id).then((data) => {
			this.initialize();
		}).catch((e) => {
			console.log(e);
		})
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
		appbaseService.getBillingInfo().then((data) => {
			this.setState({
				billingInfo: data
			});
		}).catch((e) => {
			console.log(e);
		})
	}

	calcPercentage(app, field) {
		let count = field === 'action' ? (app.info && app.info.appStats && app.info.appStats.calls ? app.info.appStats.calls : 0) : (app.info && app.info.appStats && app.info.appStats.records ? app.info.appStats.records : 0);
		let percentage = (100 * count) / appbaseService.planLimits[this.state.plan][field];
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
		})
	}

	updateApps(apps) {
		if (!this.stopUpdate) {
			this.setState({ apps: apps });
		}
	}

	createApp(appName) {
		this.setState({
			createAppLoading: true
		});
		appListHelper.createApp(appName, apps).then((data) => {
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
							<div className="ad-list-app" onClick={() => browserHistory.push(`/dashboard/app/${app.name}`)}>
								<h3 className="title">{app.name}</h3>
								<div className="description">
									<div className="row clearfix ad-metrics-summary">
										<div className="col-xs-6">
											<div className="sub-title col-xs-12">
												Api calls
											</div>
											<div className="col-xs-12 p-0">
												<span className="progress-wrapper">
													<Circle percent={appCount.action.percentage} strokeWidth="20" trailWidth="20" trailColor={this.trailColor} strokeColor={this.themeColor} />
												</span>
												<span className="progress-text">
													<strong>{comman.compressNumber(appCount.action.count)}</strong> of
													<p>{comman.compressNumber(appbaseService.planLimits[this.state.plan].action)}</p>
												</span>
											</div>
										</div>
										<div className="col-xs-6">
											<div className="sub-title col-xs-12">
												Records
											</div>
											<div className="col-xs-12 p-0">
												<span className="progress-wrapper">
													<Circle percent={appCount.records.percentage} strokeWidth="20" trailWidth="20" trailColor={this.trailColor} strokeColor={this.themeColor} />
												</span>
												<span className="progress-text">
													<strong>{comman.compressNumber(appCount.records.count)}</strong> of
													<p>{comman.compressNumber(appbaseService.planLimits[this.state.plan].records)}</p>
												</span>
											</div>
										</div>
									</div>
									<div className="row">
										<p className="col-xs-12 time">
											{this.timeAgo(app) ? `Last activity ${this.timeAgo(app)}` : " "}
										</p>
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
				<header className="ad-list-header row">
					<div className="container">
						<AppIntro name={appbaseService.userInfo.body.details.given_name} />
						<AppTutorial />
						<NewApp
							createApp={this.createApp} 
							apps={this.state.apps}
							createAppLoading={this.state.createAppLoading}
							createAppError={this.state.createAppError}
							clearInput={this.state.clearInput} />
					</div>
				</header>
				<main className="ad-list-apps container">
					{this.renderElement('apps')}
				</main>
			</div>
		);
	}

}
