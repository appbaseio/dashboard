const _ = require("lodash");
const $ = require('jquery');

class AppbaseService {
	constructor() {
		this.userInfo = null;
		this.apps = {};
		this.address = 'https://accapi.appbase.io/';
		this.billingAddress = 'https://transactions.appbase.io';
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
		this.sortBy = {
			field: "lastActiveDate",
			order: 'desc'
		};
		$.ajaxSetup({
			crossDomain: true,
			xhrFields: {
				withCredentials: true
			}
		});
	}

	getUser() {
		return new Promise((resolve, reject) => {
			$.get(this.address + 'user')
				.done((data) => {
					this.userInfo = data;
					resolve({ userInfo: data });
				}).fail((e) => {
					reject(e);
				});
		});
	}

	getBillingInfo() {
		return new Promise((resolve, reject) => {
			if (this.billingInfo) {
				resolve(this.billingInfo);
			} else {
				let requestData = {
					c_id: this.userInfo.body.c_id
				};
				$.post(this.billingAddress + '/api/me', requestData)
					.done((data) => {
						this.billingInfo = data;
						resolve(data);
					}).fail((e) => {
						reject(e);
					});
			}
		});
	};

	getPermission(appId, cache=false) {
		return new Promise((resolve, reject) => {
			if (this.apps && this.apps[appId] && this.apps[appId].permissions && cache) {
				resolve(this.apps[appId].permissions);
			} else {
				this.apps[appId] = this.apps[appId] ? this.apps[appId] : {};
				$.get(this.address + 'app/' + appId + '/permissions').done((data) => {
					this.apps[appId].permissions = data;
					resolve(data);
				}).fail((e) => {
					reject(e);
				});
			}
		});
	}

	getShare(appId, cache=false) {
		return new Promise((resolve, reject) => {
			if (this.apps && this.apps[appId] && this.apps[appId].share && cache) {
				resolve(this.apps[appId].share);
			} else {
				this.apps[appId] = this.apps[appId] ? this.apps[appId] : {};
				$.get(this.address + 'app/' + appId + '/share').done((data) => {
					this.apps[appId].share = data;
					resolve(data);
				}).fail((e) => {
					reject(e);
				});
			}
		});
	}

	getAppInfo(appId) {
		return new Promise((resolve, reject) => {
			if (this.apps && this.apps[appId] && this.apps[appId].appInfo) {
				resolve(this.apps[appId].appInfo);
			} else {
				this.apps[appId] = this.apps[appId] ? this.apps[appId] : {};
				$.get(this.address + 'app/' + appId).done((data) => {
					this.apps[appId].appInfo = data;
					resolve(data);
				}).fail((e) => {
					reject(e);
				});
			}
		});
	}

	getMetrics(appId) {
		return new Promise((resolve, reject) => {
			if (this.apps && this.apps[appId] && this.apps[appId].metrics) {
				resolve(this.apps[appId].metrics);
			} else {
				this.apps[appId] = this.apps[appId] ? this.apps[appId] : {};
				$.get(this.address + 'app/' + appId + '/metrics').done((data) => {
					this.apps[appId].metrics = data;
					resolve(data);
				}).fail((e) => {
					reject(e);
				});
			}
		});
	}

	createApp(appName) {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: this.address + 'app/' + appName,
				type: 'PUT',
				success: (result) => {
					let id = JSON.stringify(result.body.id);
					this.apps[id] = {};
					if (this.userInfo.body.apps) {
						this.userInfo.body.apps[appName] = id;
					} else {
						this.userInfo.body.apps = {
							[appName]: id
						}
					}
					resolve(result);
				},
				error: (error) => {
					reject(error);
				}
			});
		});
	}

	updatePermission(appId, username, info) {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: `${this.address}app/${appId}/permission/${username}`,
				type: 'PATCH',
				contentType: "application/json",
				dataType: "json",
				data: JSON.stringify(info),
				success: (result) => {
					resolve(result);
				},
				error: (error) => {
					reject(error);
				}
			});
		});
	}

	newPermission(appId, info) {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: `${this.address}app/${appId}/permissions`,
				type: 'POST',
				contentType: "application/json",
				dataType: "json",
				data: JSON.stringify(info),
				success: (result) => {
					resolve(result);
				},
				error: (error) => {
					reject(error);
				}
			});
		});
	}

	deletePermission(appId, username) {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: `${this.address}app/${appId}/permission/${username}`,
				type: 'DELETE',
				contentType: "application/json",
				dataType: "json",
				success: (result) => {
					resolve(result);
				},
				error: (error) => {
					reject(error);
				}
			});
		});
	}

	newShare(appId, info) {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: `${this.address}app/${appId}/share`,
				type: 'POST',
				contentType: "application/json",
				dataType: "json",
				data: JSON.stringify(info),
				success: (result) => {
					resolve(result);
				},
				error: (error) => {
					reject(error);
				}
			});
		});
	}

	updateShare(appId, user, info) {
		return new Promise((resolve, reject) => {
			this.deleteShare(appId, user.username, {email: user.email}).then((data) => {
				const request = {
					email: user.email,
					user: user.email,
					read: info.read,
					write: info.write,
					description: 'Shared with '+user.email
				};
				this.newShare(appId, request).then((data) => {
					resolve(data);
				}).catch((e) => {
					reject(e);
				});
			}).catch((e) => {
				reject(e);
			});
		});
	}

	deleteShare(appId, username, request) {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: `${this.address}app/${appId}/share/${username}`,
				type: 'DELETE',
				contentType: "application/json",
				dataType: "json",
				data: JSON.stringify(request),
				success: (result) => {
					resolve(result);
				},
				error: (error) => {
					reject(error);
				}
			});
		});
	}

	deleteApp(id) {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: this.address + 'app/' + id,
				type: 'DELETE',
				success: (result) => {
					this.getUser().then((data) => {
						resolve(result);
					}).catch((e) =>{
						console.log(e);
						resolve(result);
					});
				},
				error: (error) => {
					reject(error);
				}
			});
		});
	}

	logout() {
		var baseURL = window.location.protocol + "//" + window.location.host+'/';
		window.location.href = this.address + 'logout?next=' + baseURL;
	}

	computeMetrics(metrics) {
		var totalRecords = 0;
		var totalStorage = 0;
		var totalCalls = 0;
		var current_date = new Date();
		// current_date.setMonth(current_date.getMonth() - 1);
		current_date.setDate(1);

		totalRecords += parseInt(metrics.body.overall.numDocs) || 0;
		totalStorage += metrics.body.overall.storage / (Math.pow(1024, 2)) || 0; // in MB
		//console.log(metrics.body);

		metrics.body.month.buckets.forEach(function(bucket) {
			if (bucket.key >= current_date.getTime())
				totalCalls += bucket.apiCalls.value;
		});
		
		return {
			storage: totalStorage.toFixed(3),
			records: totalRecords,
			calls: totalCalls
		};
	}

	applySort(apps, field) {
		if(field) {
			this.sortBy.order = field === this.sortBy.field ? (this.sortBy.order === 'desc' ? 'asc' : 'desc') : 'asc';
			this.sortBy.field = field;
		}
		apps =  _.sortBy(apps, this.sortBy.field);
		if(this.sortBy.order === 'desc') {
			apps = apps.reverse();
			const prefixArray = apps.filter(item => item[this.sortBy.field]);
			const postfixArray = apps.filter(item => item[this.sortBy.field] === null);
			apps = prefixArray.concat(postfixArray);
		}
		return apps;
	}
}

export const appbaseService = new AppbaseService();
