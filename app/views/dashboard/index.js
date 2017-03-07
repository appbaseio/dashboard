import React, { Component } from 'react';
import { Link } from 'react-router';
import { appbaseService } from '../../service/AppbaseService';
import HighChartView from './HighChartView';
import ApiCallsView from './ApiCallsView';
import AppPage from '../../shared/AppPage';

export default class Dashboard extends Component {

	constructor(props) {
		super(props);
		this.state = {
			info: {},
			plan: 'free',
			graphMethod: 'month',
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
		if (nextProps.params.appId != this.appName) {
			this.initialize(nextProps);
		}
	}

	initialize(props) {
		this.appName = props.params.appId;
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
			if (!this.stopUpdate) {
				this.setState({ info: this.info });
			}
			// this.setClipboard();
		});
		appbaseService.getAppInfo(this.appId).then((data) => {
			this.info.appInfo = data;
			if (!this.stopUpdate) {
				this.setState({ info: this.info });
			}
		});
		appbaseService.getMetrics(this.appId).then((data) => {
			this.info.metrics = data;
			this.info.appStats = appbaseService.computeMetrics(data);
			if (!this.stopUpdate) {
				this.setState({
					info: this.info,
					apiCalls: this.getApiCalls(data)
				});
			}
		});
	}

	pretify(obj) {
		return JSON.stringify(obj, null, 4);
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
					<header className="ad-detail-page-header col-xs-12">
						<h2 className="ad-detail-page-title">Dashboard</h2>
					</header>
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
				generatedEle = (<ApiCallsView plan={this.state.plan} appCount={appCount} />);
				break;
		}
		return generatedEle;
	}

	render() {
		return (
			<AppPage
				pageInfo={{
					currentView: 'dashboard',
					appName: this.appName,
					appId: this.appId
				}}
			>
				<div className="ad-detail-page ad-dashboard row">
					{this.renderElement('name')}
					<main className='ad-detail-page-body col-xs-12'>
						<section className="col-xs-12 col-sm-8">
							{this.renderElement('highchartView')}
						</section>
						<section className="col-xs-12 col-sm-4">
							{this.renderElement('apiCallsView')}
						</section>
					</main>
				</div>
			</AppPage>
		);
	}

}
