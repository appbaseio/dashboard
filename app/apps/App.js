import {
	default as React,
	Component
} from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router';
import { appbaseService } from '../service/AppbaseService';
import { Highchart } from '../others/Highchart';
import { Circle } from 'rc-progress';

export class App extends Component {

	constructor(props) {
		super(props);
		this.appName = this.props.params.appId;
		this.appId = appbaseService.userInfo.body.apps[this.appName];
		this.state = {
			info: {},
			plan: 'free',
			graphMethod: 'all',
			config: {
				chartConfig: {}
			},
			apiCalls: 30021
		};
	}

	componentDidMount() {
		this.getInfo();
	}

	getInfo() {
		this.info = {};
		appbaseService.getPermission(this.appId).then((data) => {
			this.info.permission = data;
			this.setState({ info: this.info });
		});
		appbaseService.getAppInfo(this.appId).then((data) => {
			this.info.appInfo = data;
			this.setState({ info: this.info });
		});
		appbaseService.getMetrics(this.appId).then((data) => {
			this.info.metrics = data;
			this.setState({ info: this.info });
		});
	}

	pretify(obj) {
		return JSON.stringify(obj, null, 4);
	}

	renderElement(ele) {
		let generatedEle = null;
		switch (ele) {
			case 'loading':
				generatedEle = (<i className="fa fa-spinner fa-spin fa-1x fa-fw"></i>);
				break;
		}
		return generatedEle;
	}

	graph(method) {
		this.setState({
			graphMethod: method
		}, this.prepareGraph);
	}

	calcPercentage(app, field) {
		let count = field === 'action' 
			? (app.info && app.info.metrics && app.info.metrics.body.month.buckets  && app.info.metrics.body.month.buckets.length && app.info.metrics.body.month.buckets[0].apiCalls.value ? app.info.metrics.body.month.buckets[0].apiCalls.value : 0) 
			: (app.info && app.info.metrics && app.info.metrics.body.month.buckets  && app.info.metrics.body.month.buckets.length && app.info.metrics.body.month.buckets[0].doc_count ? app.info.metrics.body.month.buckets[0].doc_count : 0);
		return {
			percentage: (100*count)/appbaseService.planLimits[this.state.plan][field],
			count: count
		};
	}

	render() {
		let appCount = {
			action: this.calcPercentage(this.state, 'action'),
			records: this.calcPercentage(this.state, 'records')
		};
		return (
			<div className="singleApp">
				<div className="page-info">
					<h2 className="page-title">{this.appName}</h2>
				</div>
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
				<div className="col-xs-12 col-sm-4 apiView">
					<div className="col-xs-12 col-sm-6 col-md-4 col-lg-3 app-card-container">
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
						</div>
					</div>
				</div>
			</div>
		);
	}

}
