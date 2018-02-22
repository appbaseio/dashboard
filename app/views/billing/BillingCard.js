import React, { Component } from "react";
import classNames from 'classnames';
import { billingService } from "../../service/BillingService";
import * as CardContent from "./CardContent";
import { Loading } from "../../shared/SharedComponents";
import { common } from "../../shared/helper";

export default class BillingCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			localLoading: false
		};
		this.cardInfo = billingService.planLimits[this.props.plan];
		this.changeSubscribe = this.changeSubscribe.bind(this);
		this.updateCustomer = this.updateCustomer.bind(this);
	}

	renderElement(method) {
		let generatedEle = null;
		switch(method) {
			case "freeHeader":
				generatedEle = (<CardContent.FreeHeader {...this.props} cardInfo={this.cardInfo} />)
			break;
			case "freeDescription":
				generatedEle = (<CardContent.FreeDescription {...this.props} cardInfo={this.cardInfo} />)
			break;
			case "bootstrapHeader":
				generatedEle = (<CardContent.BootstrapHeader {...this.props} cardInfo={this.cardInfo} />)
			break;
			case "bootstrapDescription":
				generatedEle = (<CardContent.BootstrapDescription {...this.props} cardInfo={this.cardInfo} />)
			break;
			case "growthHeader":
				generatedEle = (<CardContent.GrowthHeader {...this.props} cardInfo={this.cardInfo} />)
			break;
			case "growthDescription":
				generatedEle = (<CardContent.GrowthDescription {...this.props} cardInfo={this.cardInfo} />)
			break;
		}
		return generatedEle;
	}

	changeSubscribe() {
		this.customerCopy = JSON.parse(JSON.stringify(this.props.customer));
		if(this.props.plan === 'free') {
			this.updateCustomer();
		}
		else {
			if(this.customerCopy.hasOwnProperty('stripeKey') && this.customerCopy.stripeKey) {
				if(this.customerCopy.subscriptionId) {
					this.updateCustomer();
				} else {
					this.props.checkoutInit(this.props.plan, this.updateText());
				}
			} else {
				this.props.checkoutInit(this.props.plan);
			}
		}
	}

	updateText() {
		return 'Your old plan amount will be adjust in new plan.';
	}

	updateCustomer() {
		this.customerCopy.plan = this.props.plan;
		this.customerCopy.mode = this.props.mode;
		this.setState({
			localLoading: true
		});
		billingService.paymentInfo(this.customerCopy).then((resData) => {
			console.log(resData);
			var data = resData.message;
			data.invoice.total = (data.invoice.total/100)
			data.invoice.total = (data.invoice.total).toFixed(2);
			
			this.billingText = {
				finalMode: data.invoice.total < 0 ? 'Your net refund amount will be ' : 'Your net payment due will be ',
				refund: this.setRefund(data),
				payment: this.setPayment(data)
			};
			var finalAmount = this.billingText.payment.amount - this.billingText.refund.amount;
			this.billingText.finalAmount = finalAmount < 0 ? (-finalAmount) : (finalAmount);
			this.billingText.finalAmount = this.billingText.finalAmount.toFixed(2);
			this.props.changePlanModal(this.billingText, this.customerCopy, this.props.plan);
			this.setState({
				localLoading: false
			});
		}).catch(function(data) {
			this.setState({
				localLoading: false
			});
			console.log(data);
		});
	}

	setRefund(paymentInfo) {
		var obj = {
			amount: 0,
			explain: null
		};
		paymentInfo.current_prorations.forEach((info) => {
			if(info.plan.id === this.props.activePlan+'-'+this.props.activeMode) {
				obj.amount = (info.amount/100);
				obj.amount = obj.amount < 0 ? (-obj.amount) : (obj.amount)
				obj.explain = info.description;
			} 
		});
		return obj;
	}

	setPayment(paymentInfo) {
		var obj = {
			amount: 0,
			explain: null
		};
		if(this.customerCopy.plan != 'free') {
			var found = false;
			paymentInfo.invoice.lines.data.forEach((info) => {
				if(!found && info.plan.id === this.customerCopy.plan+'-'+this.customerCopy.mode) {
					found = true;
					obj.amount = (info.amount/100);
					obj.explain = 'The charge for '+
									(this.customerCopy.mode == 'annual' ? 'annual' : 'month')+
									' '+this.customerCopy.plan+' plan'+
									' is $'+((this.customerCopy.mode==="annual") ? (obj.amount/12).toFixed(2)+'x12': obj.amount);
				}
			});
		}
		return obj;
	}

	render() {
		const cx = classNames({
			subscribed: this.props.plan === this.props.activePlan && this.props.mode === this.props.activeMode
		});
		const loadingCondition = this.props.loading === this.props.plan || this.state.localLoading;
		return (
			<div className="col-xs-12 col-sm-4 single-card-container" id={`${this.props.plan}-card`}>
				<div className="price-card">
					{this.renderElement(`${this.props.plan}Header`)}
					{this.renderElement(`${this.props.plan}Description`)}
					<ul className="description">
						<li className="subscribe-li">
							<div className="button text-center">
								<button {...common.isDisabled(loadingCondition)} className={`pos-relative new-btn get-started ${cx}`} onClick={this.changeSubscribe}>
									{
										loadingCondition ? (
											<Loading></Loading>
										) : null
									}
									<span> {
										this.props.activePlan === this.props.plan && this.props.mode === this.props.activeMode ? "Current plan" : "Subscribe plan"
									} </span>
								</button>
							</div>
						</li>
					</ul>
				</div>
			</div>
		);
	}
};
