import { billingService } from '../../service/BillingService';

class StripeSetup {
	constructor(stripeKey, checkoutCb) {
		this.handler = StripeCheckout.configure({
			key: stripeKey,
			image: '../../../assets/images/pricing/stripeLogo.png',
			locale: 'auto',
			token(response) {
				checkoutCb(response);
			},
		});
		$(window).on('popstate', () => {
			this.handler.close();
		});
	}
	checkoutOpen(description, plan) {
		const desc = description || 'charged monthly';
		this.handler.open({
			name: `appbase.io ${plan} plan`,
			description: desc,
			amount: billingService.prices.monthly[plan] * 100,
			opened() {
				// $scope.footer(false);
			},
			closed() {
				// $scope.footer(true);
			},
		});
	}

	getAmount(mode, plan) {
		const months = mode === 'annual' ? 12 : 1;
		return billingService.prices[mode][plan] * 100 * months;
	}
}

const checkoutCb = function (customer, userProfile, response) {
	function updateStripeCustomer(response) {
		const requestData = {
			email: userProfile.email,
			customerId: customer.stripeKey,
			stripeToken: response.id,
		};
		return billingService.updateStripeCustomer(requestData);
	}
	function createStripeCustomer(response) {
		const requestData = {
			email: userProfile.email,
			stripeKey: response.id,
		};
		return billingService.stripeConnect(requestData);
	}
	let res = null;
	if (customer.stripeKey) {
		res = updateStripeCustomer.call(this, response);
	} else {
		res = createStripeCustomer.call(this, response);
	}
	return res;
};

module.exports = {
	StripeSetup,
	checkoutCb,
};
