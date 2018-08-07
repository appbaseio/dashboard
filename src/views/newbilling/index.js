import React from 'react';
import { Card } from 'antd';
import { css } from 'emotion';
import PricingCard from './../../shared/PricingTable';
import { billingService } from '../../service/BillingService';
import { appbaseService } from '../../service/AppbaseService';
import { StripeSetup, checkoutCb } from '../../shared/utils/StripeSetup';
import ConfirmPlanChange from './ConfirmPlanChange';
import Flex from '../../shared/Flex';

const planCls = css`
	color: rgb(35, 46, 68);
	font-size: 2.5rem;
	font-weight: 600;
	padding: 30px 0px;
`;
const updateText = () => 'Your old plan amount will be adjust in new plan.';
class Billing extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// localLoading: false,
			loadingModal: false,
			showPlanChange: false,
			billingText: null,
			plan: 'free',
			mode: 'monthly',
			customer: undefined,
			customerCopy: undefined,
			tempPlan: undefined,
		};
		// this.stripeKey = 'pk_test_s0n1Ls5xPnChuOdxjcYkBQc6';
		// this.stripeKey = 'pk_test_DYtAxDRTg6cENksacX1zhE02';
		// this.stripeKey = 'pk_XCCvCuWKPx07ODJUXqFr7K4cdHvAS';
		this.stripeKey = 'pk_live_ihb1fzO4h1ykymhpZsA3GaQR';
		this.userProfile = appbaseService.userInfo.body;
		this.allowedPlan = ['free', 'bootstrap', 'growth', 'dedicated'];
		this.count = 0;
	}
	componentDidMount() {
		this.checkCustomer();
	}
	checkCustomer = () => {
		const requestData = {
			c_id: this.userProfile.c_id,
		};
		this.count += 1;
		billingService
			.getCustomer(requestData)
			.then((data) => {
				const customer = data;
				const plan = this.allowedPlan.indexOf(data.plan) > -1 ? data.plan : 'free';
				this.stripeExists = 'stripeKey' in data;
				if (!this.stripeExists || !data.subscriptionId) {
					this.stripeSetup = new StripeSetup(this.stripeKey, this.stripeCb.bind(this));
				}
				this.setState({
					customer,
					plan,
				});
			})
			.catch((data) => {
				if (data && data.message === 'NOTEXISTS') {
					this.createCustomer();
				} else if (data.message === 'Error fetching client from mssql') {
					this.checkCustomer();
				}
			});
	};
	createCustomer = () => {
		const customerObj = {
			email: this.userProfile.email,
			userInfo: this.userProfile,
		};
		billingService
			.createCustomer(customerObj)
			.then(() => {
				this.checkCustomer();
			})
			.catch(() => {});
	};
	checkoutInit = (plan, description) => {
		this.checkoutPlan = plan;
		this.checkoutMode = this.state.mode;
		if (!this.stripeSetup) {
			this.stripeSetup = new StripeSetup(this.stripeKey, this.stripeCb.bind(this));
		}
		this.stripeSetup.checkoutOpen(description, plan, this.price);
	};

	subscribePlan = (plan, price) => {
		this.price = price;
		this.customerCopy = JSON.parse(JSON.stringify(this.state.customer));
		if (plan === 'free') {
			this.updateCustomer(plan);
		} else if (this.customerCopy.stripeKey && this.customerCopy.stripeKey) {
			if (this.customerCopy.subscriptionId) {
				this.updateCustomer(plan);
			} else {
				this.checkoutInit(plan, updateText());
			}
		} else {
			this.checkoutInit(plan);
		}
	};
	stripeCb = (response) => {
		this.setState({
			loadingModal: true,
		});
		checkoutCb(this.state.customer, this.userProfile, response)
			.then(() => {
				this.setState(
					{
						customerCopy: this.state.customer,
						tempPlan: this.checkoutPlan,
						mode: this.checkoutMode,
					},
					this.confirmPlan.bind(this),
				);
			})
			.catch(() => {
				this.setState({
					loadingModal: false,
				});
			});
	};
	updateCustomer(plan) {
		this.customerCopy.plan = plan;
		this.customerCopy.mode = this.state.mode;
		// this.setState({
		// 	localLoading: true,
		// });
		billingService
			.paymentInfo(this.customerCopy)
			.then((resData) => {
				const data = resData.message;
				data.invoice.total /= 100;
				data.invoice.total = data.invoice.total.toFixed(2);

				this.billingText = {
					finalMode:
						data.invoice.total < 0
							? 'Your net refund amount will be '
							: 'Your net payment due will be ',
					refund: this.setRefund(data),
					payment: this.setPayment(data),
				};
				const finalAmount =
					this.billingText.payment.amount - this.billingText.refund.amount;
				this.billingText.finalAmount = finalAmount < 0 ? -finalAmount : finalAmount;
				this.billingText.finalAmount = this.billingText.finalAmount.toFixed(2);
				this.changePlanModal(this.billingText, this.customerCopy, plan);
				// this.setState({
				// 	localLoading: false,
				// });
			})
			.catch((data) => {
				// this.setState({
				// 	localLoading: false,
				// });
				console.log(data);
			});
	}
	changePlanModal(billingText, customerCopy, tempPlan) {
		this.setState({
			showPlanChange: true,
			billingText,
			customerCopy,
			tempPlan,
		});
	}
	closeModal = () => {
		this.setState({
			showPlanChange: false,
		});
	};
	confirmPlan = () => {
		this.customerCopy = this.state.customerCopy;
		this.customerCopy.plan = this.state.tempPlan;
		this.customerCopy.mode = this.state.mode;
		this.pricingError = {
			show: false,
			text: '',
		};
		this.setState({
			loadingModal: true,
		});
		billingService
			.updateCustomer(this.customerCopy, 'planChange')
			.then((data) => {
				this.customer = data;
				this.plan = data.plan;
				this.setState({
					customer: this.customer,
					plan: data.plan,
					mode: data.mode,
					loadingModal: false,
				});
				this.closeModal();
			})
			.catch(() => {
				this.setState({
					loadingModal: false,
				});
			});
	};
	render() {
		return (
			<React.Fragment>
				<Card>
					<Flex alignItems="center" justifyContent="center">
						<div css={planCls}>
							Your current plan is: {this.state.plan.toUpperCase()} {this.state.mode}
						</div>
					</Flex>
				</Card>
				<PricingCard onClickButton={this.subscribePlan} />
				<ConfirmPlanChange
					billingText={this.state.billingText}
					showPlanChange={this.state.showPlanChange}
					customer={this.state.customerCopy}
					tempPlan={this.state.tempPlan}
					mode="montly"
					closeModal={() => this.closeModal()}
					activePlan={this.state.plan}
					confirmPlan={this.confirmPlan}
					loadingModal={this.state.loadingModal}
				/>
			</React.Fragment>
		);
	}
}

export default Billing;
