import React, { Component } from 'react';
import { appbaseService } from '../../service/AppbaseService';
import Header from './Header';
import BillingCard from './BillingCard';
import ConfirmPlanChange from './ConfirmPlanChange';
import { billingService } from "../../service/BillingService";
import { StripeSetup, checkoutCb} from "../../shared/utils/StripeSetup";

export default class Billing extends Component {
	constructor(props, context) {
		super(props);
		this.stripeKey = 'pk_test_s0n1Ls5xPnChuOdxjcYkBQc6';
		// this.stripeKey = 'pk_XCCvCuWKPx07ODJUXqFr7K4cdHvAS';
		var localBillingMode = localStorage.getItem('billingMode');
		this.allowedPlan = ['free', 'bootstrap', 'growth', 'dedicated'];
		this.modeText = {
			'monthly': 'monthly',
			'annually': 'annual'
		};
		this.planText = 'Choose plan';
		const mode = localBillingMode && (localBillingMode == 'monthly' || localBillingMode == 'annually') ? localBillingMode : 'annually';
		
		this.state = {
			mode: mode,
			plan: 'free',
			activeMode: mode,
			activePlan: 'free',
			customer: {
				plan: 'free',
				mode: 'annually'
			},
			pricingError: {
				show: false,
				text: ''
			},
			loading: null,
			loadingModal: false,
			showPlanChange: false,
			customerCopy: null,
			billingText: null
		};
		this.changePlan = this.changePlan.bind(this);
		this.changePlanModal = this.changePlanModal.bind(this);
		this.confirmPlan = this.confirmPlan.bind(this);
		this.checkoutInit = this.checkoutInit.bind(this);
		this.init();
	}

	init() {
		this.count = 0;
		this.userProfile = appbaseService.userInfo.body;
		this.checkCustomer();
	}

	checkCustomer() {
		var requestData = {
			c_id: this.userProfile.c_id
		};
		this.count++;
		billingService.getCustomer(requestData).then((data) => {
			this.customer = data;
			this.customer.mode = data.mode ? data.mode : this.state.mode;
			this.plan = this.allowedPlan.indexOf(data.plan) > -1 ? data.plan : 'free';
			this.stripeExists = ("stripeKey" in data) ? true : false;
			if(!this.stripeExists) {
				this.stripeSetup = new StripeSetup(this.stripeKey, this.stripeCb.bind(this));
			}
			this.setState({
				customer: this.customer,
				mode: this.customer.mode,
				plan: this.plan,
				activeMode: this.customer.mode,
				activePlan: this.customer.plan
			});
		}).catch((data) => {
			if(data && data.message === 'NOTEXISTS') {
				this.createCustomer();
			}
			else if(data.message === 'Error fetching client from mssql') {
				this.checkCustomer();
			}
		});
	}

	createCustomer() {
		var customerObj = {
			email: this.userProfile.email,
			userInfo: this.userProfile
		};
		billingService.createCustomer(customerObj).then((data) => {
			this.checkCustomer();
		}).catch((data) => {
		});
	}

	changePlanModal(billingText, customerCopy, tempPlan) {
		this.setState({
			showPlanChange: true,
			billingText,
			customerCopy,
			tempPlan
		});
	}

	changePlan(mode) {
		this.setState({
			mode
		})
	}

	closeModal() {
		this.setState({
			showPlanChange: false
		});
	}

	checkoutInit(plan, description) {
		this.checkoutPlan = plan;
		this.checkoutMode = this.state.mode;
		this.stripeSetup.checkoutOpen(description, plan, this.state.mode);
	}

	stripeCb(response) {
		this.setState({
			loading: this.checkoutPlan,
			loadingModal: true
		});
		checkoutCb(this.state.customer, this.userProfile, response).then((data) => {
			this.setState({
				customerCopy: this.state.customer,
				tempPlan: this.checkoutPlan,
				mode: this.checkoutMode
			}, this.confirmPlan.bind(this));
		}).catch((e) => {
			this.setState({
				loading: null,
				loadingModal: false
			});
		})
	}

	confirmPlan() {
		this.customerCopy = this.state.customerCopy;
		this.customerCopy.plan = this.state.tempPlan;
		this.customerCopy.mode = this.state.mode;
		this.pricingError = {
			show: false,
			text: ''
		};
		this.setState({
			loading: this.customerCopy.plan,
			loadingModal: true
		})
		billingService.updateCustomer(this.customerCopy, 'planChange').then((data) => {
			this.customer = data;
			this.plan = data.plan;
			this.setState({
				customer: this.customer,
				activePlan: data.plan,
				activeMode: data.mode,
				loading: null,
				loadingModal: false
			});
			this.closeModal();
		}).catch((data) => {
			this.setState({
				show: true,
				text: data && data.message && data.message.raw && data.message.raw.message ? data.message.raw.message : data,
				loading: null,
				loadingModal: false
			})
		});
	}

	renderElement(method) {
		let generatedEle = null;
		switch(method) {
			case 'cards':
				generatedEle = Object.keys(billingService.planLimits).map((plan, index) => {
					return (
						<BillingCard
							key={index}
							mode={this.state.mode}
							plan={plan}
							customer={this.state.customer}
							activePlan={this.state.activePlan}
							activeMode={this.state.activeMode}
							changePlanModal={this.changePlanModal}
							checkoutInit={this.checkoutInit}
							loading={this.state.loading}
						/>
					)
				});
			break;
		}
		return generatedEle;
	}

	render() {
		return (
			<div>
				<div id="pricing-page">
					<Header customer={this.state.customer} mode={this.state.mode} changePlan={this.changePlan} />
					<section className="container-fluid" id="cards">
						<div className="row cards-container">
							{this.renderElement('cards')}
						</div>
					</section>
				</div>
				<ConfirmPlanChange
					billingText={this.state.billingText}
					showPlanChange={this.state.showPlanChange}
					customer={this.state.customerCopy}
					tempPlan={this.state.tempPlan}
					mode={this.state.mode}
					closeModal={() => this.closeModal()}
					activePlan={this.state.plan}
					confirmPlan={this.confirmPlan}
					loadingModal={this.state.loadingModal}
				/>
			</div>
		);
	}
}
