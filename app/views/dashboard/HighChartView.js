import React, { Component } from 'react';

import Highchart from '../../shared/Highchart';

export default class HighChartView extends Component {

	constructor(props) {
		super(props);
		const now = new Date();
		this.state = {
			graphMethod: now.getDate() < 3 ? "week" : "month",
			infoType: "overview"
		};
	}

	graph(method) {
		this.setState({
			graphMethod: method
		});
	}

	info(infoType) {
		this.setState({
			infoType
		});
	}

	render() {
		return (
			<section className="ad-detail-page-body-card graph-view">
				<header className="ad-detail-page-body-card-title body-card-title-highchart">
					<span>API Calls</span>
				</header>
				<main className="ad-detail-page-body-card-body">
					<header className="tab-container col-xs-12">
						<ul className="nav-tab pull-left">
							<li>
								<a className={this.state.infoType === 'overview' ? 'active' : ''} onClick={() => this.info('overview')}>Overview</a>
							</li>
							<li>
								<a className={this.state.infoType === 'breakdown' ? 'active' : ''} onClick={() => this.info('breakdown')}>Breakdown</a>
							</li>
						</ul>
						<ul className="nav-tab pull-right">
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
					</header>
					<Highchart
						id="chart1"
						graphMethod={this.state.graphMethod}
						info={this.props.info}
						infoType={this.state.infoType}
					>
					</Highchart>
				</main>
			</section>
		);
	}

}
