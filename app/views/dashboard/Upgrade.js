import React, { Component } from 'react';
import { Link } from 'react-router';

export default class Upgrade extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let billingClass = null;
		if(this.props.appCount.action.percentage >= 100) {
			billingClass = 'danger';
		}
		else if(this.props.appCount.action.percentage >= 80) {
			billingClass = 'warning';
		}
		return (
			<div>
				{
					this.props.appCount.action.percentage > 80 ? (
						<section className="ad-detail-page-body-card api-view">
							<header className="ad-detail-page-body-card-title">
								<span>This app requires a plan upgrade.</span>
							</header>
							<main className="ad-detail-page-body-card-body body-card-body-api-view row">
								<div className="col-xs-12">
									<Link to ="/billing" className={`ad-theme-btn col-xs-12 text-center lg-btn transparent ${billingClass}`}>
										Upgrade Now
									</Link>
								</div>
							</main>
						</section>
					) :  null
				}
			</div>
		);
	}

}
