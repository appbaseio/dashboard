import React, { Component } from 'react';
import { Circle } from 'rc-progress';
import { appbaseService } from '../../service/AppbaseService';
import { billingService } from '../../service/BillingService';
import { common } from '../../shared/helper';

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
					<span>Usage this month</span>
				</header>
				<main className="ad-detail-page-body-card-body body-card-body-api-view row ad-metrics-summary">
					<div className="col-xs-12">
						<div className="col-xs-12 col-sm-6 progress-container">
							<span className="progress-wrapper">
								<Circle percent={this.props.appCount.action.percentage} strokeWidth="20" trailWidth="20" trailColor={this.trailColor} strokeColor={this.themeColor} />
							</span>
							<div className="progress-text">
								<div className="sub-title">
									Api calls
								</div>
								{
									this.props.plan ? (
										<div>
											<strong>{common.compressNumber(this.props.appCount.action.count)}</strong>/
											<span>{common.compressNumber(billingService.planLimits[this.props.plan].action)}</span>
										</div>
									) : null
								}
							</div>
						</div>
						<div className="col-xs-12 col-sm-6 progress-container">
							<span className="progress-wrapper">
								<Circle percent={this.props.appCount.records.percentage} strokeWidth="20" trailWidth="20" trailColor={this.trailColor} strokeColor={this.themeColor} />
							</span>
							<div className="progress-text">
								<div className="sub-title">
									Records
								</div>
								{
									this.props.plan ? (
										<div>
											<strong>{common.compressNumber(this.props.appCount.records.count)}</strong> /
											<span>{common.compressNumber(billingService.planLimits[this.props.plan].records)}</span>
										</div>
									) : null
								}
							</div>
						</div>
					</div>
				</main>
			</section>
		);
	}

}
