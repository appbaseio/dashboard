import React, { Component } from 'react';
import { Link } from 'react-router';
import { billingService } from '../../../service/BillingService';

export default class Upgrade extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showAlert: false,
			exceedsApps: []
		};
	}

	componentWillReceiveProps(nextProps) {
		let flag = false;
		let exceedsApps = [];
		if(nextProps.plan && nextProps.apps) {
			nextProps.apps.forEach((app) => {
				const obj = {
					action: this.getPercentage(app, "action", nextProps.plan),
					records: this.getPercentage(app, "records", nextProps.plan),
					name: app.name,
					id: app.id
				};
				if(obj.action >= 100 || obj.action >= 100) {
					exceedsApps.push(obj);
				}
			});
			this.setState({
				exceedsApps,
				showAlert: exceedsApps.length ? true : false
			});
		}
	}

	getPercentage(app, field, plan) {
		let count = field === 'action' ? (app.info && app.info.appStats && app.info.appStats.calls ? app.info.appStats.calls : 0) : (app.info && app.info.appStats && app.info.appStats.records ? app.info.appStats.records : 0);
		let percentage = (100 * count) / billingService.planLimits[plan][field];
		percentage = percentage < 100 ? percentage : 100;
		return percentage;
	}

	close() {
		this.setState({
			showAlert: false
		});
	}

	render() {
		return (
			<div>
				{
					this.state.showAlert ? (
						<div className="alert alert-warning alert-dismissible">
							<button type="button" className="close" onClick={() => this.close()}><span aria-hidden="true">&times;</span></button>
							Your {this.state.exceedsApps.length} apps are exceeds&nbsp;
							<Link to ="/billing" className="">
								Upgrade Now
							</Link>
						</div>
					) :  null
				}
			</div>
		);
	}

}
