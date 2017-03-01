import {
	default as React,
	Component
} from 'react';
import { Circle } from 'rc-progress';
import { render } from 'react-dom';
import { Link, browserHistory } from 'react-router';
import {NewApp} from './NewApp';
import {ActionButtons} from './actionButtons';
import * as AppListComponent from './appListComponent';
import { appbaseService } from '../service/AppbaseService';

const AppIntro = (props) => {
	return (
		<AppListComponent.AppCard>
			<h3 className="title">What is an app?</h3>
			<p className="description">
				Lorem ipsum dolor sit amet, consectetur adipisicing elit.
				Fugiat vero molestias reiciendis, iure hic, maxime aperiam assumenda ipsa 
				temporibus neque numquam perferendis,
				nostrum harum facere. Commodi incidunt rem assumenda, sed!
			</p>
		</AppListComponent.AppCard>
	);
}

const AppTutorial = (props) => {
	return (
		<AppListComponent.AppCard>
			<h3 className="title">InteractiveTutorial</h3>
			<p className="description">
				Lorem ipsum dolor sit amet, consectetur adipisicing elit.
			</p>
		</AppListComponent.AppCard>
	);
}

export class AppsList extends Component {

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
			this.setApps();
		}).catch((e)=> {
			console.log(e);
		})
	}

	componentWillUnmount() {
		this.stopUpdate = true;
	}

	initialize() {
		this.getBillingInfo();
		this.setApps();
	}

	setApps() {
		this.setSort = true;
		let apps = appbaseService.userInfo.body.apps;
		let storeApps = [];
		Object.keys(apps).forEach((app, index) => {
			var obj = {
				name: app,
				id: apps[app]
			};
			storeApps[index] = obj;
		});
		this.registerApps(storeApps, true);
	}

	registerApps(apps, getInfo=false) {
		this.setState({
			apps: apps
		}, function() {
			if(getInfo) {
				this.getAppInfo.call(this)
			}
		}.bind(this));
	}

	getBillingInfo() {
		appbaseService.getBillingInfo().then((data) => {
			this.setState({
				billingInfo: data
			});
		}).catch((e)=> {
			console.log(e);
		})
	}

	calcPercentage(app, field) {
		let count = field === 'action' 
			? (app.info && app.info.appStats && app.info.appStats.calls ? app.info.appStats.calls : 0) 
			: (app.info && app.info.appStats && app.info.appStats.records ? app.info.appStats.records : 0);
		let percentage = (100*count)/appbaseService.planLimits[this.state.plan][field];
		percentage = percentage < 100 ? percentage : 100;
		return {
			percentage: percentage,
			count: count
		};
	}

	getAppInfo() {
		let apps = this.state.apps;
		this.appsInfoCollected = 0;
		apps.forEach((app, index) => {
			this.getInfo(app.id, index);
		});
	}

	getInfo(appId, index) {
		var apps = this.state.apps;
		var info = {};
		appbaseService.getMetrics(appId).then((data) => {
			info.metrics = data;
			info.appStats = appbaseService.computeMetrics(data);
			apps[index].apiCalls = info.appStats.calls;
			apps[index].records = info.appStats.records;
			apps[index].info = info;
			cb.call(this);
		}).catch((e) => {
			console.log(e);
		});
		function cb() {
			this.appsInfoCollected++;
			if(!this.stopUpdate && this.appsInfoCollected === this.state.apps.length) {
				this.setState({apps: apps}, sortApps.bind(this));
			}
		}
		function sortApps() {
			if(this.setSort) {
				this.setSort = false;
				let apps = appbaseService.applySort(this.state.apps);
				this.setState({apps: apps});
			}
		}
	}

	createApp(appName) {
		this.setState({
			createAppLoading: true
		});
		appbaseService.createApp(appName).then((data) => {
			let apps = this.state.apps;
			apps.unshift({
				name: appName,
				id: data
			});
			this.setState({
				createAppLoading: false,
				apps: apps,
				clearInput: true
			});
		}).catch((e) => {
			console.log(e);
			let error = null;
			try {
				error = JSON.parse(e.responseText);
			} catch(e) {}
			this.setState({
				createAppLoading: false,
				createAppError: error
			});
		});
	}

	renderElement(ele) {
		var generatedEle = null;
		switch(ele) {
			case 'apps':
				let apps = this.state.apps;
				generatedEle = apps.map((app, index) => {
					let appCount = {
						action: this.calcPercentage(app, 'action'),
						records: this.calcPercentage(app, 'records')
					};
					return (
						<AppListComponent.AppCard key={index}>
							<div className="app-list-item" onClick={() => browserHistory.push(`/dashboard/app/${app.name}`)}>
								<h3 className="title">{app.name}</h3>
								<div className="description">
									<div className="row">
										<div className="col-xs-6">
											<div className="col-xs-12 p-0">
												<span className="progress-wrapper">
													<Circle percent={appCount.action.percentage} strokeWidth="20" trailWidth="20" trailColor={this.trailColor} strokeColor={this.themeColor} />
												</span>
												<span className="progress-text">
													<strong>{appCount.action.count}</strong>
													<p>/{appbaseService.planLimits[this.state.plan].action}</p>
												</span>
											</div>
											<div className="sub-title">
												Api calls
											</div>
										</div>
										<div className="col-xs-6">
											<span className="progress-wrapper">
												<Circle percent={appCount.records.percentage} strokeWidth="20" trailWidth="20" trailColor={this.trailColor} strokeColor={this.themeColor} />
											</span>
											<span className="progress-text">
												<strong>{appCount.records.count}</strong>
												<p>/{appbaseService.planLimits[this.state.plan].count}</p>
											</span>
										</div>
									</div>
								</div>
							</div>
						</AppListComponent.AppCard>
					);
				});
			break;
		}
		return generatedEle;
	}

	render() {
		return (
			<div className="appList">
				<div className="head-row row">
					<div className="container">
						<AppIntro />
						<AppTutorial />
						<NewApp
							createApp={this.createApp} 
							apps={this.state.apps}
							createAppLoading={this.state.createAppLoading}
							createAppError={this.state.createAppError}
							clearInput={this.state.clearInput} />
					</div>
				</div>
				<div className="container apps-container">
					{this.renderElement('apps')}
				</div>
			</div>
		);
	}

}
