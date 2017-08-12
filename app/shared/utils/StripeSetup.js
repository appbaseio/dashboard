import { billingService } from "../../service/BillingService";
const $ = require('jquery');

class StripeSetup {
	constructor(stripeKey, checkoutCb) {
		this.handler = StripeCheckout.configure({
			key: stripeKey,
			image: '../../../assets/images/pricing/stripeLogo.png',
			locale: 'auto',
			token: function(response) {
				checkoutCb(response);
			}
		});
		$(window).on('popstate', function() {
			this.handler.close();
		});
	}
	checkoutOpen(description, plan, mode) {
		description = description ? description : 'charged ' + mode;
		this.handler.open({
			name: 'appbase.io '+ plan + ' plan',
			description: description,
			amount: this.getAmount(mode, plan),
			opened: function() {
				// $scope.footer(false);
			},
			closed: function() {
				// $scope.footer(true);
			}
		});
	}
	getAmount(mode, plan) {
		var months = mode === 'annual' ? 12 : 1;
		return billingService.prices[mode][plan]*100*months;
	}
}

const checkoutCb = function(customer, userProfile, response) {
	function updateStripeCustomer(response) {
		let requestData = {
			email: userProfile.email,
			customerId: customer.stripeKey,
			stripeToken: response.id
		};
		return billingService.updateStripeCustomer(requestData);
	}
	function createStripeCustomer(response) {
		var requestData = {
			email: userProfile.email,
			stripeKey: response.id
		};
		return billingService.stripeConnect(requestData)
	}
	let res = null;
	if(customer.stripeKey) {
		res = updateStripeCustomer.call(this, response);
	} else {
		res = createStripeCustomer.call(this, response);
	}
	return res;
}
module.exports = {
	StripeSetup: StripeSetup,
	checkoutCb: checkoutCb
}
