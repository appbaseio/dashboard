import React, { Component } from 'react';
import { Link } from 'react-router';
import { appbaseService } from '../../service/AppbaseService';
import { billingService } from '../../service/BillingService';
import HighChartView from './HighChartView';
import ApiCallsView from './ApiCallsView';
import AppPage from '../../shared/AppPage';
import Upgrade from './Upgrade';
import DashboardGettingStarted from './DashboardGettingStarted';

export default class Dashboard extends Component {

	constructor(props) {
		super(props);
		this.state = {
			info: {},
			plan: null,
			graphMethod: 'month',
			config: {
				chartConfig: {}
			},
			totalApiCalls: 0,
			apiCalls: 0,
			waitingForApiCalls: true
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
			this.setState({
				waitingForApiCalls: true
			}, this.initialize.bind(this, nextProps));
		}
	}

	initialize(props) {
		this.appName = props.params.appId;
		this.appId = appbaseService.userInfo.body.apps[this.appName];
		this.getInfo();
		this.getBillingInfo();
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
				this.setState({
					plan: "free"
				});
				console.log(e);
			})
		}
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
		});
		appbaseService.getAppInfo(this.appId).then((data) => {
			this.info.appInfo = data;
			if (!this.stopUpdate) {
				this.setState({ info: this.info });
			}
		});
		appbaseService.getMetrics(this.appId).then((data) => {
			this.info.metrics = data;
			const totalApiCalls = this.getTotalApiCalls(data);
			this.info.appStats = appbaseService.computeMetrics(data);
			if (!this.stopUpdate) {
				this.setState({
					info: this.info,
					apiCalls: this.getApiCalls(data),
					totalApiCalls,
					waitingForApiCalls: false
				});
			}
		});
	}

	getTotalApiCalls(data) {
		let apiCalls = 0;
		const buckets = data.body && data.body.month && data.body.month.buckets ? data.body.month.buckets : [];
		buckets.forEach((bucket) => {
			apiCalls += bucket.apiCalls.value;
		});
		return apiCalls;
	}

	pretify(obj) {
		return JSON.stringify(obj, null, 4);
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

	appCount() {
		let obj = {
			action: {
				percentage: 0,
				count: 0
			},
			records: {
				percentage: 0,
				count: 0
			}
		};
		if(this.state.plan) {
			obj = {
				action: this.calcPercentage(this.state, 'action'),
				records: this.calcPercentage(this.state, 'records')
			};
		}
		return obj;
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
					<header className="ad-detail-page-header header-inline-summary col-xs-12">
						<h2 className="ad-detail-page-title">Dashboard</h2>
						<p>Check the statistics of your app over here</p>
					</header>
					<main className='ad-detail-page-body col-xs-12'>
						<section className="col-xs-12 col-sm-8">
							{
								this.state.totalApiCalls || this.state.waitingForApiCalls ? (
									<HighChartView
										apiCalls={this.state.apiCalls}
										graphMethod={this.state.graphMethod}
										info={this.state.info}
									>
									</HighChartView>
								) : (
									<DashboardGettingStarted appName={this.appName} appId={this.appId}></DashboardGettingStarted>
								)
							}
						</section>
						<section className="col-xs-12 col-sm-4">
							<ApiCallsView plan={this.state.plan} appCount={this.appCount()} />
							<Upgrade plan={this.state.plan} appCount={this.appCount()} />
						</section>
					</main>
				</div>
			</AppPage>
		);
	}

}
