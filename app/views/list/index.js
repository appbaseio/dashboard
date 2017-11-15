import React, { Component } from 'react';
import { Circle } from 'rc-progress';
import { Link, browserHistory } from 'react-router';
import classNames from 'classnames';
import NewApp from './components/NewApp';
import ActionButtons from './components/ActionButtons';
import AppCard from './components/AppCard';
import { appbaseService } from '../../service/AppbaseService';
import { billingService } from '../../service/BillingService';
import { appListHelper, common, intercomService } from '../../shared/helper';
import { AppOwner } from '../../shared/SharedComponents';
import SortBy from './components/SortBy';
import FilterByAppname from './components/FilterByAppname';
import FilterByOwner from './components/FilterByOwner';
import Upgrade from './components/Upgrade';
import CloneApp from './components/CloneApp';
import { getConfig } from '../../config';
import { OldDashboard } from '../../shared/SharedComponents';

const moment = require('moment');

const AppIntro = (props) => {
	return (
		<AppCard {...props}>
			<h3 className="title">Hi {props.name ? props.name.split(" ")[0] : null},</h3>
			<p className="description">
				This is your apps manager view. Here, you can create a new app and manage your existing apps.
			</p>
		</AppCard>
	);
}

const AppTutorial = (props) => {
	return (
		<AppCard style={{"textAlign":"center"}} {...props}>
			<h3 className="title">Quick Links</h3>
			{getConfig().quickLinks}
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
			createAppError: null,
			clearInput: false
		};
		this.themeColor = getConfig().accent;
		this.trailColor = '#eee';
		this.createApp = this.createApp.bind(this);
		this.deleteApp = this.deleteApp.bind(this);
		this.registerApps = this.registerApps.bind(this);
		this.config = getConfig();
	}

	componentWillMount() {
		this.stopUpdate = false;
		if(appbaseService.userInfo) {
			this.initialize();
		} else {
			appbaseService.pushUrl();
		}
	}

	deleteApp(selectedApp) {
		appbaseService.deleteApp(selectedApp.id).then((data) => {
			const apps = this.state.apps.filter(app => app.id !== selectedApp.id);
			appbaseService.preservedApps = appbaseService.preservedApps.filter(app => app.id !== selectedApp.id);
			if(appbaseService.preservedApps.length === 0) {
				appbaseService.pushUrl('/tutorial');
			}
			this.setState({
				apps
			});
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
		this.getApps();
	}

	getApps() {
		appbaseService.allApps()
		.then((data) => {
			const apps = appbaseService.getPreservedApps(data.body);
			appbaseService.setPreservedApps(apps);
			this.registerApps(apps, true);
		}).catch((e) => {
			console.log(e);
			appbaseService.pushUrl('/login');
		});
	}

	registerApps(apps, getInfo = false) {
		if(appbaseService.preservedApps.length === 0 && !appbaseService.filterAppName.trim().length) {
			appbaseService.pushUrl('/tutorial');
		} else {
			this.setState({
				apps
			}, (() => {
				if (getInfo) {
					this.getAppInfo.call(this)
				}
			}));
		}
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
		let count = field === 'action' ? (app && app.api_calls ? app.api_calls : 0) : (app && app.records ? app.records : 0);
		let percentage = (100 * count) / billingService.planLimits[this.state.plan][field];
		percentage = percentage < 100 ? percentage : 100;
		return {
			percentage: percentage,
			count: count
		};
	}

	getAppInfo() {
		let apps = this.state.apps;
		appbaseService.allMetrics().then((data) => {
			apps = apps.map((app) => {
				return Object.assign(app, data.body[app.id]);
			});
			apps = appbaseService.applySort(apps, appbaseService.sortBy.field);
			apps = appbaseService.filterBySharedApps();
			this.registerApps(apps);
			this.setIntercomData(data.body);
		}).catch((e) => {
			console.log(e);
		});
		appbaseService.allPermissions().then((data) => {
			apps = apps.map((app) => {
				return Object.assign(app, appListHelper.filterPermissions(data.body[app.id]));
			});
			this.registerApps(apps);
		}).catch((e) => {
			console.log(e);
		});
	}

	setIntercomData(metrics) {
		const userInfo = {
			email: appbaseService.userInfo.body.email,
			calls: 0,
			records: 0,
			apps: Object.keys(metrics).length,
			[getConfig().name]: true
		};
		Object.keys(metrics).forEach((item) => {
			userInfo.calls += metrics[item].api_calls;
			userInfo.records += metrics[item].records;
		});
		intercomService.update(userInfo);
	}

	updateApps(apps) {
		if (!this.stopUpdate) {
			this.setState({ apps: apps });
			appbaseService.setExtra("allApps", apps);
		}
	}

	createApp(appname) {
		appbaseService.createApp(appname).then((data) => {
			this.setState({
				createAppLoading: false,
				clearInput: true
			});
			appbaseService.pushUrl(`/dashboard/${appname}`);
		}).catch((e) => {
			this.setState({
				createAppError: e.responseJSON,
				createAppLoading: false
			});
			console.log(e);
		});
	}

	timeAgo(app) {
		return app && app.lastAciveOn ? moment(app.lastAciveOn).fromNow() : null;
	}

	isShared(app) {
		return app && appbaseService && appbaseService.userInfo && appbaseService.userInfo.body && app.owner !== appbaseService.userInfo.body.email ? true : false;
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
					const cx = classNames({
						"with-owner": this.isShared(app)
					});
					return (
						<AppCard key={app.id}>
							<div className="ad-list-app" onClick={() => appbaseService.pushUrl(`/dashboard/${app.appname}`)}>
								<span className="ad-list-app-bg-container">
									<i className={`fa ${this.config.cardIcon} ad-list-app-bg`}></i>
								</span>
								<main className="ad-list-app-content">
									<header className={`ad-list-app-header ${cx}`}>
										<div className="ad-list-title-container">
											<AppOwner app={app} />
											<h3 className="title">{app.appname}</h3>
											<CloneApp app={app} />
										</div>
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
								</main>
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
				<OldDashboard />
				{
					appbaseService.userInfo ?
					(
						<div>
							<header className="ad-list-header row">
								<div className="container flexcontainer">
									<AppIntro setClassName="hidden-xs" name={appbaseService.userInfo.body.details.name} />
									<AppTutorial setClassName="hidden-xs hidden-sm" />
									<NewApp
										createApp={this.createApp}
										apps={this.state.apps}
										createAppLoading={this.state.createAppLoading}
										createAppError={this.state.createAppError}
										clearInput={this.state.clearInput}
									/>
								</div>
							</header>
							<main className="ad-list-container container">
								<Upgrade apps={this.state.apps} plan={this.state.plan} />
								<div className="ad-list-filters col-xs-12 p-0 text-right">
									<SortBy apps={this.state.apps} registerApps={this.registerApps} />
									<FilterByAppname registerApps={this.registerApps} />
									<FilterByOwner registerApps={this.registerApps} />
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
