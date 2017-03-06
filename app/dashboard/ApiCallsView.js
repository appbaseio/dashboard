import React, { Component } from 'react';
import { Circle } from 'rc-progress';
import { render } from 'react-dom';
import { appbaseService } from '../service/AppbaseService';
import { comman } from '../shared/helper';

export default class ApiCallsView extends Component {

	constructor(props) {
		super(props);
		this.themeColor = '#CDDC39';
		this.trailColor = '#eee';
	}

	render() {
		return (
			<section className="ad-detail-page-body-card api-view">
				<header className="ad-detail-page-body-card-title">
					<span>Api calls</span>
				</header>
				<main className="ad-detail-page-body-card-body body-card-body-api-view row ad-metrics-summary">
					<span className="col-xs-12 col-sm-6">
						<div className="sub-title col-xs-12">
							Api calls
						</div>
						<div className="col-xs-12 p-0">
							<span className="progress-wrapper">
								<Circle percent={this.props.appCount.action.percentage} strokeWidth="20" trailWidth="20" trailColor={this.trailColor} strokeColor={this.themeColor} />
							</span>
							<span className="progress-text">
								<strong>{comman.compressNumber(this.props.appCount.action.count)}</strong> of
								<p>{comman.compressNumber(appbaseService.planLimits[this.props.plan].action)}</p>
							</span>
						</div>
					</span>
					<span className="col-xs-12 col-sm-6">
						<div className="sub-title col-xs-12">
							Storage
						</div>
						<div className="col-xs-12 p-0">
							<span className="progress-wrapper">
								<Circle percent={this.props.appCount.records.percentage} strokeWidth="20" trailWidth="20" trailColor={this.trailColor} strokeColor={this.themeColor} />
							</span>
							<span className="progress-text">
								<strong>{comman.compressNumber(this.props.appCount.records.count)}</strong> of
								<p>{comman.compressNumber(appbaseService.planLimits[this.props.plan].records)}</p>
							</span>
						</div>
					</span>
				</main>
			</section>
		);
	}

}
