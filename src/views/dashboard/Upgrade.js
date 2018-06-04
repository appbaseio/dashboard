import React, { Component } from 'react';
import { Link } from 'react-router';

export default class Upgrade extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let billingClass = null;
		if (
			this.props.appCount.action.percentage >= 100 ||
			this.props.appCount.records.percentage >= 100
		) {
			billingClass = 'danger';
		} else if (
			this.props.appCount.action.percentage >= 80 ||
			this.props.appCount.records.percentage >= 80
		) {
			billingClass = 'warning';
		}
		return (
			<div>
				{this.props.appCount.action.percentage > 80 ||
				this.props.appCount.records.percentage > 80 ? (
					<section className="api-view upgrade">
						<main className="ad-detail-page-body-card-body body-card-body-api-view row">
							<Link to="/billing" className="ad-theme-btn primary">
								Upgrade My Plan
							</Link>
						</main>
					</section>
				) : null}
			</div>
		);
	}
}
