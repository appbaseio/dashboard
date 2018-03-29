import { browserHistory } from 'react-router';

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
		this.sortOptions = {
			"created_at": "Most Recent",
			"api_calls": "API Calls",
			"records": "Records",
			"appname": "Name"
		};
		this.defaultSortBy ="created_at";
		this.sortBy = {
			field: this.getSortBy(),
			order: 'desc'
		};
		this.filterAppName = "";
		this.preservedApps = [];
		this.extra = {};
		this.context = '/';
		this.sharedApps = this.getShareApps();
		$.ajaxSetup({
			crossDomain: true,
			xhrFields: {
				withCredentials: true
			}
		});
		this.profileCheckDate = '2018-03-27T18:04:57.641963Z'	// when the profile feature went live
	}

	getSortBy() {
		const sortby = localStorage.getItem("ai-sortby");
		return sortby ? ( Object.keys(this.sortOptions).indexOf(sortby) > -1 ? sortby : this.defaultSortBy ) : this.defaultSortBy;
	}

	getShareApps() {
		const sharedApps = localStorage.getItem("ai-sharedApps");
		return sharedApps === "false" ? false : true;
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

	getPermission(appId, cache=false) {
		return new Promise((resolve, reject) => {
			// if (this.apps && this.apps[appId] && this.apps[appId].permissions && cache) {
			// 	resolve(this.apps[appId].permissions);
			// } else {
				this.apps[appId] = this.apps[appId] ? this.apps[appId] : {};
				$.get(this.address + 'app/' + appId + '/permissions').done((data) => {
					this.apps[appId].permissions = data;
					resolve(data);
				}).fail((e) => {
					reject(e);
				});
			// }
		});
	}

	getShare(appId, cache=false) {
		return new Promise((resolve, reject) => {
			// if (this.apps && this.apps[appId] && this.apps[appId].share && cache) {
			// 	resolve(this.apps[appId].share);
			// } else {
				this.apps[appId] = this.apps[appId] ? this.apps[appId] : {};
				$.get(this.address + 'app/' + appId + '/share').done((data) => {
					this.apps[appId].share = data;
					resolve(data);
				}).fail((e) => {
					reject(e);
				});
			// }
		});
	}

	getAppInfo(appId, cache=false) {
		return new Promise((resolve, reject) => {
			// if (this.apps && this.apps[appId] && this.apps[appId].appInfo && cache) {
			// 	resolve(this.apps[appId].appInfo);
			// } else {
				this.apps[appId] = this.apps[appId] ? this.apps[appId] : {};
				$.get(this.address + 'app/' + appId).done((data) => {
					this.apps[appId].appInfo = data;
					resolve(data);
				}).fail((e) => {
					reject(e);
				});
			// }
		});
	}

	getMetrics(appId, cache=false) {
		return new Promise((resolve, reject) => {
			// if (this.apps && this.apps[appId] && this.apps[appId].metrics && cache) {
			// 	resolve(this.apps[appId].metrics);
			// } else {
				this.apps[appId] = this.apps[appId] ? this.apps[appId] : {};
				$.get(this.address + 'app/' + appId + '/metrics').done((data) => {
					this.apps[appId].metrics = data;
					resolve(data);
				}).fail((e) => {
					reject(e);
				});
			// }
		});
	}

	allApps(cached=false) {
		return new Promise((resolve, reject) => {
			if(cached && this.userApps) {
				resolve(this.userApps);
			} else {
				$.get(this.address + 'user/apps').done((data) => {
					this.userApps = data;
					resolve(data);
				}).fail((e) => {
					reject(e);
				});
			}
		});
	}

	allMetrics() {
		return new Promise((resolve, reject) => {
			$.get(this.address + 'user/apps/metrics').done((data) => {
				resolve(data);
			}).fail((e) => {
				reject(e);
			});
		});
	}

	allPermissions() {
		return new Promise((resolve, reject) => {
			$.get(this.address + 'user/apps/permissions').done((data) => {
				resolve(data);
			}).fail((e) => {
				reject(e);
			});
		});
	}

	createApp(appData) {
		let appsObj = {
			allApps: null,
			user: null
		};
		return new Promise((resolve, reject) => {
			$.ajax({
				url: this.address + 'app/' + appData.appname,
				type: 'PUT',
				contentType: "application/json",
				dataType: "json",
				data: JSON.stringify({ category: appData.category, es_version: appData.es_version }),
				success: (result) => {
					this.preservedApps = [];
					this.allApps().then((data) => {
						appsObj.allApps = data;
						cb(result);
					}).catch((e) => {
						appsObj.allApps = e;
						cb(result);
					});
					this.getUser().then((data) => {
						appsObj.user =data;
						cb(result);
					}).catch((e) => {
						appsObj.user = e;
						cb(result);
					});
				},
				error: (error) => {
					reject(error);
				}
			});
			const cb = (result) => {
				if(appsObj.user && appsObj.allApps) {
					resolve(result);
				}
			}
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

	transferOwnership(appId, info) {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: `${this.address}app/${appId}/changeowner`,
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
		localStorage.setItem('reload', true);
		var baseURL = window.location.protocol + "//" + window.location.host+'/';
		window.location.href = this.address + 'logout?next=https://appbase.io';
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
			if(field !== "appname") {
				this.sortBy.order = 'desc';
			} else {
				this.sortBy.order = 'asc';
			}
			this.sortBy.field = field;
			apps = _.sortBy(apps, this.sortBy.field);
			if(this.sortBy.order === 'desc') {
				apps = apps.reverse();
			}
			const prefixArray = apps.filter(item => item.owner === this.userInfo.body.email);
			const postfixArray = apps.filter(item => item.owner !== this.userInfo.body.email);
			apps = prefixArray.concat(postfixArray);
			const preservedApps = this.filterAppName === "" ? apps : this.preservedApps;
			this.setPreservedApps(preservedApps);
		}
		return apps;
	}

	applyFilter(apps, field) {
		let filteredApps = apps;
		if(this.extra.allApps) {
			if(field === "all") {
				filteredApps = this.extra.allApps;
			} else if(field === "myapps") {
				filteredApps = this.extra.allApps.filter((app) => {
					return this.isMyApp(app);
				});
			} else if(field === "shared") {
				filteredApps = this.extra.allApps.filter((app) => {
					return !this.isMyApp(app);
				});
			}
		}
		return filteredApps;
	}

	getPreservedApps(apps) {
		let preservedApps = localStorage.getItem("ai-apps");
		preservedApps = preservedApps ? JSON.parse(preservedApps) : [];
		let finalApps = [];
		const appInFinalApps = [];
		preservedApps.forEach((item) => {
			const isAppExists = apps.filter(app => item.appname === app.appname);
			if(isAppExists && isAppExists.length) {
				finalApps.push(isAppExists[0]);
				appInFinalApps.push(isAppExists[0].appname);
			}
		});
		const otherApps = apps.filter(app => appInFinalApps.indexOf(app.appname) < 0);
		return finalApps.concat(otherApps);
	}

	setPreservedApps(apps) {
		this.preservedApps = apps;
		localStorage.setItem("ai-apps", JSON.stringify(this.preservedApps));
		localStorage.setItem("ai-sortby", this.sortBy.field);
	}

	filterByAppname(appname) {
		this.filterAppName = appname;
		return appbaseService.preservedApps.filter(app => app.appname.indexOf(appname) > -1);
	}

	filterBySharedApps(sharedApps=this.sharedApps) {
		localStorage.setItem("ai-sharedApps", sharedApps);
		return appbaseService.preservedApps.filter(app => sharedApps ? true : (app.owner === appbaseService.userInfo.body.email) );
	}

	isMyApp(app) {
		return app && app.appInfo && app.appInfo.owner === this.userInfo.body.email;
	}

	isAppNameAvailable(appname) {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: this.address + 'apps/' + appname,
				type: 'GET',
				success: resolve,
				error: reject
			});
		});
	}

	setExtra(key, value) {
		this.extra[key] = value;
	}

	setUserInfo(userInfo) {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: this.address + 'user/profile',
				type: 'PUT',
				contentType: "application/json",
				dataType: "json",
				data: JSON.stringify(userInfo),
				success: (result) => {
					resolve(result);
				},
				error: (error) => {
					reject(error);
				}
			});
		});
	}

	pushUrl(url=null) {
		const context = this.context === '/' ? '' : this.context;
		const finalRoute = url ? context+url : this.context;
		browserHistory.push(finalRoute);
	}

	getContextPath() {
		return this.context === '/' ? '/' : this.context+'/';
	}
}

export const appbaseService = new AppbaseService();
