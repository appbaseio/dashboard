const _ = require("lodash");
import { $http } from "../shared/helper";

class BillingService {
	constructor() {
		this.address = 'https://accapi.appbase.io/';
		this.billingAddress = 'https://transactions.appbase.io';
		// this.billingAddress = 'http://127.0.0.1:8080';
		this.planLimits = {
			'free': {
				action: 100000,
				records: 10000
			},
			'bootstrap': {
				action: 1000000,
				records: 100000
			},
			'growth': {
				action: 10000000,
				records: 1000000
			}
		};
		this.prices = {
			'monthly': {
				'bootstrap': 29,
				'growth': 89,
				'dedicated': 499
			},
			'annually': {
				'bootstrap': 19,
				'growth': 59,
				'dedicated': 299
			}
		}
	}
	getCustomer(requestData) {
		return $http.start({
			url: this.billingAddress + '/api/me',
			data: requestData,
			method: 'POST'
		});
	};
	createCustomer(requestData) {
		return $http.start({
			url: this.billingAddress + '/api/createCustomer',
			data: requestData,
			method: 'POST'
		});
	};
	stripeConnect(requestData) {
		return $http.start({
			url: this.billingAddress + '/api/stripeConnect',
			data: requestData,
			method: 'POST'
		});
	};
	updateStripeCustomer(requestData) {
		return $http.start({
			url: this.billingAddress + '/api/updateStripeCustomer',
			data: requestData,
			method: 'POST'
		});
	};
	updateCustomer(requestData, method) {
		return $http.start({
			url: this.billingAddress + '/api/updateCustomer/' + method,
			data: requestData,
			method: 'POST'
		});
	};
	paymentInfo(requestData, method) {
		return $http.start({
			url: this.billingAddress + '/api/paymentInfo',
			data: requestData,
			method: 'POST'
		});
	};
	updateSubscribe(requestData) {
		return $http.start({
			url: this.billingAddress + '/billing/subscribe',
			data: requestData,
			method: 'PUT'
		});
	};
	cancelSubscription(requestData) {
		return $http.start({
			url: this.billingAddress + '/billing/cancelSubscription',
			data: requestData,
			method: 'POST'
		});
	};
	usage(start, end) {
		var url = this.billingAddress + '/usage';
		if (start && end) {
			url = this.billingAddress + '/usage?start=' + start + '&end=' + end;
		}
		return $http.start({
			url: url,
			method: 'GET'
		});
	};
	calculator() {
		return $http.start({
			url: this.billingAddress + '/calculator',
			method: 'GET'
		});
	};
}

export const billingService = new BillingService();
