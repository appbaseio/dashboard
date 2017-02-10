import {
	default as React,
	Component
} from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router';
import { appbaseService } from '../service/AppbaseService';
import { Highchart } from '../others/Highchart';
import { Circle } from 'rc-progress';
import Clipboard from 'Clipboard';
import {Topbar} from './Topbar';

export class Dashboard extends Component {

	constructor(props) {
		super(props);
		this.state = {
			info: {},
			plan: 'free',
			graphMethod: 'all',
			config: {
				chartConfig: {}
			},
			apiCalls: 0
		};
		this.themeColor = '#CDDC39';
		this.trailColor = '#fff';
	}

	componentWillMount() {
		this.stopUpdate = false;
		this.initialize(this.props);
	}

	componentWillUnmount() {
		this.stopUpdate = true;
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.appName != this.appName) {
			this.initialize(nextProps);
		}
	}

	initialize(props) {
		this.appName = props.appName;
		this.appId = appbaseService.userInfo.body.apps[this.appName];
		this.getInfo();
	}

	getApiCalls(data) {
		let total = 0;
		data.body.month.buckets.forEach((bucket) => {
			total += bucket.apiCalls.value;
		});
		return total;
	}

	getInfo() {
		this.info = {};
		appbaseService.getPermission(this.appId).then((data) => {
			this.info.permission = data;
			if(!this.stopUpdate) {
				this.setState({ info: this.info });
			}
			// this.setClipboard();
		});
		appbaseService.getAppInfo(this.appId).then((data) => {
			this.info.appInfo = data;
			if(!this.stopUpdate) {
				this.setState({ info: this.info });
			}
		});
		appbaseService.getMetrics(this.appId).then((data) => {
			this.info.metrics = data;
			if(!this.stopUpdate) {
				this.setState({ 
					info: this.info,
					apiCalls: this.getApiCalls(data)
				});
			}
		});
	}

	setClipboard() {
		new Clipboard('.permission-username', {
			text: (trigger) => {
				return this.info.permission.body[0].username;
			}
		});
		new Clipboard('.permission-password', {
			text: (trigger) => {
				return this.info.permission.body[0].password;
			}
		});
	}

	pretify(obj) {
		return JSON.stringify(obj, null, 4);
	}

	graph(method) {
		this.setState({
			graphMethod: method
		}, this.prepareGraph);
	}

	calcPercentage(app, field) {
		let count = field === 'action' 
			? (this.state.apiCalls ? this.state.apiCalls : 0) 
			: (app.info && app.info.metrics && app.info.metrics.body.month.buckets  && app.info.metrics.body.month.buckets.length && app.info.metrics.body.month.buckets[0].doc_count ? app.info.metrics.body.month.buckets[0].doc_count : 0);
		return {
			percentage: (100*count)/appbaseService.planLimits[this.state.plan][field],
			count: count
		};
	}

	appCount() {
		return {
			action: this.calcPercentage(this.state, 'action'),
			records: this.calcPercentage(this.state, 'records')
		};
	}

	renderElement(ele) {
		let generatedEle = null;
		let appCount;
		switch (ele) {
			case 'loading':
				generatedEle = (<i className="fa fa-spinner fa-spin fa-1x fa-fw"></i>);
			break;
			case 'name':
				generatedEle = (
					<div className="page-info col-xs-12">
						<h2 className="page-title">{this.appName}</h2>
					</div>
				);
			break;
			case 'highchartView':
				appCount = this.appCount();
				generatedEle = (
					<div className="col-xs-12 col-sm-8 graphView">
						<div className="graph-title">
							Usage <span className="summary">{this.state.apiCalls} API Calls</span>
						</div>
						<ul className="nav-tab">
							<li>
								<a className={this.state.graphMethod === 'week' ? 'active' : ''} onClick={() => this.graph('week')}>Week</a>
							</li>
							<li>
								<a className={this.state.graphMethod === 'month' ? 'active' : ''} onClick={() => this.graph('month')}>Month</a>
							</li>
							<li>
								<a className={this.state.graphMethod === 'all' ? 'active' : ''} onClick={() => this.graph('all')}>All</a>
							</li>
						</ul>
						<div className="graph">
							<Highchart 
								id="chart1" 
								graphMethod={this.state.graphMethod}
								info={this.state.info}>
							</Highchart>
						</div>
					</div>
				);
			break;
			case 'apiCallsView':
				appCount = this.appCount();
				generatedEle = (
					<div className="col-xs-12 app-card-container">
						<div className="app-card col-xs-12">
							<span className="col-sm-12 col-md-6 app-card-progress progress-api-calls">
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
							<span className="col-sm-12 col-md-6 app-card-progress progress-storage-calls">
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
						</div>
					</div>
				);
			break;
			case 'permissionView':
				generatedEle = (
					<div className="col-xs-12 app-card-container">
						<div className="app-card permissionView col-xs-12">
							<div className="col-xs-12 permission-row">
								<span className="key">Username:&nbsp;</span><span className="value permission-username">{this.info && this.info.permission ? this.info.permission.body[0].username : ''}</span>
							</div>
							<div className="col-xs-12 permission-row">
								<span className="key">Password:&nbsp;</span><span className="value permission-password">{this.info && this.info.permission ? this.info.permission.body[0].password : ''}</span>
							</div>
						</div>
					</div>
				);
			break;
		}
		return generatedEle;
	}

	render() {
		return (
			<div className="singleApp row">
				{this.renderElement('name')}
				{this.renderElement('highchartView')}
				<div className="col-xs-12 col-sm-4 apiView">
					{this.renderElement('apiCallsView')}
					{this.renderElement('permissionView')}
				</div>
			</div>
		);
	}

}
