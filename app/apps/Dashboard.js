import { default as React, Component } from 'react';
import { Link } from 'react-router';
import { appbaseService } from '../service/AppbaseService';
import { Circle } from 'rc-progress';
import Clipboard from 'Clipboard';
import { Topbar } from './Topbar';
import { HighChartView, ApiCallsView, CredentialsView } from './appComponents';

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
						<h2 className="page-title">Dashboard</h2>
					</div>
				);
			break;
			case 'highchartView':
				appCount = this.appCount();
				generatedEle = (
					<HighChartView
						apiCalls={this.state.apiCalls}
						graphMethod={this.state.graphMethod}
						info={this.state.info}
					/>
				);
			break;
			case 'apiCallsView':
				appCount = this.appCount();
				generatedEle = (<ApiCallsView appCount={appCount} />);
			break;
			case 'permissionView':
				generatedEle = (<CredentialsView info={this.info} />);
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
