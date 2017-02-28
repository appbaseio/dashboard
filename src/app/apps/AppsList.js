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
		let apps = appbaseService.userInfo.body.apps;
		let storeApps = [];
		Object.keys(apps).forEach((app, index) => {
			var obj = {
				name: app,
				id: apps[app]
			};
			storeApps[index] = obj;
		});
		this.registerApps(storeApps);
	}

	registerApps(apps) {
		this.setState({
			apps: apps
		}, this.getAppInfo);
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
			// info.apiCalls = this.getApiCalls(data);
			cb.call(this);
		}).catch((e) => {
			console.log(e);
		});
		function cb() {
			apps[index].info = info;
			if(!this.stopUpdate) {
				this.setState({apps: apps}, sortApps.bind(this));
			}
		}
		function sortApps() {
			this.appsInfoCollected++;
			if(this.appsInfoCollected === this.state.apps.length) {
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
						<div key={index} className="app-list-item row" onClick={() => browserHistory.push(`/app/${app.name}`)}>
							<div className="col-xs-12 col-sm-4">{app.name}</div>
							<div className="col-xs-12 col-sm-4">
								
								<span className="text">{appCount.action.count}</span>
							</div>
							<div className="col-xs-12 col-sm-4">
								
								<span className="text">{appCount.records.count}</span>
							</div>
							<ActionButtons key={index} app={app} deleteApp={this.deleteApp} />
						</div>
					);
				});
			break;
		}
		return generatedEle;
	}

	render() {
		return (
			<div className="appList container">
				<div className="page-info">
					<h2 className="page-title">Welcome, {appbaseService.userInfo.body.details.name}!</h2>
				</div>
				<div className="row apps">
					<NewApp
						createApp={this.createApp} 
						apps={this.state.apps}
						createAppLoading={this.state.createAppLoading}
						createAppError={this.state.createAppError}
						clearInput={this.state.clearInput} />
					<AppListComponent.Header apps={this.state.apps} registerApps={this.registerApps} />
					{this.renderElement('apps')}
				</div>
			</div>
		);
	}

}
