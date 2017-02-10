import {
	default as React,
	Component
} from 'react';
import { Circle } from 'rc-progress';
import { render } from 'react-dom';
import { Link } from 'react-router';
import {NewApp} from './NewApp';
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
		this.trailColor = '#fff';
		this.createApp = this.createApp.bind(this);
	}

	componentWillMount() {
		this.initialize();
	}

	initialize() {
		this.getBillingInfo();
		let apps = appbaseService.userInfo.body.apps;
		var storeApps = [];
		Object.keys(apps).forEach((app, index) => {
			var obj = {
				name: app,
				id: apps[app]
			};
			storeApps[index] = obj;
		});
		this.setState({
			apps: storeApps
		}, this.getAppInfo);
	}

	getApiCalls(data) {
		let total = 0;
		data.body.month.buckets.forEach((bucket) => {
			total += bucket.apiCalls.value;
		});
		return total;
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
			? (app.info && app.info.apiCalls ? app.info.apiCalls : 0) 
			: (app.info && app.info.metrics && app.info.metrics.body  && app.info.metrics.body.overall.numDocs ? app.info.metrics.body.overall.numDocs : 0);
		return {
			percentage: (100*count)/appbaseService.planLimits[this.state.plan][field],
			count: count
		};
	}

	getAppInfo() {
		let apps = this.state.apps;
		apps.forEach((app, index) => {
			this.getInfo(app.id, index);
		});
	}

	getInfo(appId, index) {
		var info = {};
		appbaseService.getMetrics(appId).then((data) => {
			info.metrics = data;
			info.apiCalls = this.getApiCalls(data);
			cb.call(this);
		}).catch((e) => {
			console.log(e);
		});
		function cb() {
			var apps = this.state.apps;
			apps[index].info = info;
			this.setState({apps: apps});
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
						<div key={index} className="col-xs-12 col-sm-6 col-md-4 col-lg-3 app-card-container">
							<div className="app-card col-xs-12">
								<span className="col-xs-6 app-card-progress progress-api-calls">
									<div className="app-card-progress-container">
										<Circle percent={appCount.action.percentage} strokeWidth="4" trailWidth="6" trailColor={this.trailColor} strokeColor={this.themeColor} />
										<span className="appCount">
											{appCount.action.count}
										</span>
									</div>
									<p className="caption">
										Api calls
									</p>
								</span>
								<span className="col-xs-6 app-card-progress progress-storage-calls">
									<div className="app-card-progress-container">
										<Circle  percent={appCount.records.percentage} strokeWidth="4" trailWidth="6" trailColor={this.trailColor} strokeColor={this.themeColor} />
										<span className="appCount">
											{appCount.records.count}
										</span>
									</div>
									<p className="caption">
										Storage
									</p>
								</span>
								<div className="col-xs-12 title">
									<Link className="theme-btn" to={`/app/${app.name}`}>{app.name}</Link>
								</div>
							</div>
						</div>
					);
				});
			break;
		}
		return generatedEle;
	}

	render() {
		return (
			<div className="appList">
				<div className="page-info">
					<h2 className="page-title">Welcome, {appbaseService.userInfo.body.details.name}!</h2>
					<p className="page-description">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod quas dolores voluptates minima dignissimos repellendus placeat beatae dolorem totam? Facere animi totam, ipsum deleniti, aspernatur nostrum autem quibusdam ipsam sint!</p>
				</div>
				<div className="row apps">
					<NewApp 
						createApp={this.createApp} 
						apps={this.state.apps}
						createAppLoading={this.state.createAppLoading}
						createAppError={this.state.createAppError}
						clearInput={this.state.clearInput} />
					{this.renderElement('apps')}
				</div>
			</div>
		);
	}

}
