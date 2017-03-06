import React, { Component } from 'react';
import { render } from 'react-dom';
import Highchart from '../shared/Highchart';

export default class HighChartView extends Component {

	constructor(props) {
		super(props);
		this.state = {
			graphMethod: 'month'
		};
	}

	graph(method) {
		this.setState({
			graphMethod: method
		});
	}

	render() {
		return (
			<section className="ad-detail-page-body-card graph-view">
				<header className="ad-detail-page-body-card-title body-card-title-highchart">
					<span>Usage</span>
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
				</header>
				<main className="ad-detail-page-body-card-body">
					<Highchart 
						id="chart1" 
						graphMethod={this.state.graphMethod}
						info={this.props.info}>
					</Highchart>
				</main>
			</section>
		);
	}

}
