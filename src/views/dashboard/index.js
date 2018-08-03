import React, { Component } from 'react';
import get from 'lodash/get';
import { appbaseService } from '../../service/AppbaseService';
import { billingService } from '../../service/BillingService';
import UsageDashboard from './UsageDetails';
import HighChartView from './HighChartView';
import AppPage from '../../shared/AppPage';
import Upgrade from './Upgrade';
import DashboardGettingStarted from './DashboardGettingStarted';
import PaidUserDashboard from './PaidUserDashboard';
import Loader from '../analytics/components/Loader';

const getApiCalls = (data) => {
	let total = 0;
	data.body.month.buckets.forEach((bucket) => {
		total += bucket.apiCalls.value;
	});
	return total;
};
const getTotalApiCalls = (data) => {
	let apiCalls = 0;
	const buckets =
		data.body && data.body.month && data.body.month.buckets ? data.body.month.buckets : [];
	buckets.forEach((bucket) => {
		apiCalls += bucket.apiCalls.value;
	});
	return apiCalls;
};
export default class Dashboard extends Component {
	constructor(props) {
		super(props);
		const currentCalls = Number(window.sessionStorage.getItem('currentCalls'));
		this.currentRecords = Number(window.sessionStorage.getItem('currentRecords'));
		this.state = {
			info: {},
			plan: null,
			graphMethod: 'month',
			config: {
				chartConfig: {},
			},
			totalApiCalls: currentCalls || 0,
			apiCalls: 0,
			waitingForApiCalls: true,
		};
		this.themeColor = '#CDDC39';
		this.trailColor = '#fff';
	}
	componentDidMount() {
		this.initialize(this.props);
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.params.appId !== this.appName) {
			this.setState(
				{
					waitingForApiCalls: true,
				},
				this.initialize.bind(this, nextProps),
			);
		}
	}
	getBillingInfo() {
		if (
			appbaseService.userInfo &&
			appbaseService.userInfo.body &&
			appbaseService.userInfo.body.c_id
		) {
			const requestData = {
				c_id: appbaseService.userInfo.body.c_id,
			};
			billingService
				.getCustomer(requestData)
				.then((data) => {
					const plan =
						Object.keys(billingService.planLimits).indexOf(data.plan) > -1
							? data.plan
							: 'free';
					this.setState({
						billingInfo: data,
						plan,
					});
				})
				.catch((e) => {
					this.setState({
						plan: 'free',
					});
					console.log(e);
				});
		}
	}
	getInfo() {
		this.info = {};
		Promise.all([
			appbaseService.getPermission(this.appId),
			appbaseService.getAppInfo(this.appId),
			appbaseService.getMetrics(this.appId),
			this.getBillingInfo(),
		]).then(([permission, appInfo, metrics]) => {
			this.info = {};
			this.info.permission = permission;
			this.info.appInfo = appInfo;
			this.info.metrics = metrics;
			const totalApiCalls = getTotalApiCalls(metrics);
			this.info.appStats = appbaseService.computeMetrics(metrics);
			this.setState({
				info: this.info,
				apiCalls: getApiCalls(metrics),
				totalApiCalls,
				waitingForApiCalls: false,
			});
		});
	}

	initialize(props) {
		this.appName = props.params.appId;
		this.appId = appbaseService.userInfo.body.apps[this.appName];
		this.getInfo();
	}
	calcPercentage(app, field) {
		let count;
		if (field === 'action') {
			count = get(app, 'info.appStats.calls', 0);
		} else {
			count = get(app, 'info.appStats.records', 0);
		}
		let percentage = (100 * count) / billingService.planLimits[this.state.plan][field];
		percentage = percentage < 100 ? percentage : 100;
		return {
			percentage,
			count,
		};
	}

	appCount() {
		let obj = {
			action: {
				percentage: 0,
				count: 0,
			},
			records: {
				percentage: 0,
				count: 0,
			},
		};
		if (this.state.plan) {
			obj = {
				action: this.calcPercentage(this.state, 'action'),
				records: this.calcPercentage(this.state, 'records'),
			};
		}
		return obj;
	}

	render() {
		if (this.state.waitingForApiCalls) {
			return <Loader />;
		}
		const displayCharts =
			Boolean(this.state.totalApiCalls) ||
			Boolean(this.appCount().records.count) ||
			Boolean(this.currentRecords);
		return (
			<AppPage
				pageInfo={{
					currentView: 'dashboard',
					appName: this.appName,
					appId: this.appId,
				}}
			>
				<div className="ad-detail-page ad-dashboard row">
					{this.state.plan !== 'free' ? (
						<div className="ad-detail-page-body col-xs-12">
							<section className="col-xs-12 col-sm-8">
								{displayCharts ? (
									<HighChartView
										apiCalls={this.state.apiCalls}
										graphMethod={this.state.graphMethod}
										info={this.state.info}
									/>
								) : (
									<DashboardGettingStarted
										appName={this.appName}
										appId={this.appId}
									/>
								)}
							</section>
							<section className="col-xs-12 col-sm-4">
								<UsageDashboard plan={this.state.plan} appCount={this.appCount()} />
								<Upgrade plan={this.state.plan} appCount={this.appCount()} />
							</section>
						</div>
					) : (
						<PaidUserDashboard
							appName={this.appName}
							plan={this.state.plan}
							appCount={this.appCount()}
						/>
					)}
				</div>
			</AppPage>
		);
	}
}
