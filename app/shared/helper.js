const { EventEmitter } = require("fbemitter");
const $ = require('jquery');
const eventEmitter = new EventEmitter();
import { appbaseService } from '../service/AppbaseService';
import { AppOwner } from '../shared/SharedComponents';

class AppDashboard {
	constructor() {
		this.allowedView = ['dashboard', 'browser', 'mappings', 'builder', 'credentials', 'team'];
	}
	onEnter(activeApp, currentView) {
		const appObj = {
			activeApp,
			currentView
		};
		appbaseService.setExtra("nav", appObj);
		eventEmitter.emit('activeApp', appObj);
		localStorage.setItem('appbaseDashboardApp', activeApp);
	}
	onLeave() {
		eventEmitter.emit('activeApp', {
			activeApp: null
		});
	}
	onNotFound() {
		const currentView = window.location.pathname.replace(/\//g, '').toLowerCase();
		if(this.allowedView.indexOf(currentView) > -1) {
			const lastActiveApp = localStorage.getItem('appbaseDashboardApp');
			if(lastActiveApp) {
				this.getAppsAndRedirect(currentView, lastActiveApp);
			} else {
				this.getAppsAndRedirect(currentView);
			}
		} else {
			appbaseService.pushUrl();
		}
	}
	getAppsAndRedirect(currentView, lastActiveApp) {
		this.contextPath = appbaseService.getContextPath();
		appbaseService.getUser()
			.then((data) => {
				const apps = Object.keys(data.userInfo.body.apps);
				if(!lastActiveApp) {
					lastActiveApp = apps.length ? apps[0] : null;
				} else {
					lastActiveApp = (apps.indexOf(lastActiveApp) > -1) ? lastActiveApp : null;
				}
				if(lastActiveApp) {
					appbaseService.pushUrl(`${this.contextPath}${currentView}/${lastActiveApp}`);
				} else {
					appbaseService.pushUrl();
				}
			})
			.catch((e) => {
				appbaseService.pushUrl('/login');
			});
	}
}

class AppListHelper {
	getAll(apps, metrics = true, permission = true, appInfo = true) {
		this.apps = apps;
		return new Promise((resolve, reject) => {
			this.appsInfoCollected = 0;
			apps.forEach((app, index) => {
				this.getInfo(app.id, index, cb, metrics, permission, appInfo);

				function cb(apps) {
					resolve(apps);
				}
			});
		});
	}
	getInfo(appId, index, resolveApps, metrics = true, permission = true, appInfo = true) {
		let apps = this.apps;
		let info = {};
		let count = {
			metrics: !metrics ? true : false,
			permission: !permission ? true : false,
			appInfo: !appInfo ? true : false
		};
		const init = () => {
			if (!count.metrics) {
				getMetrics.call(this);
			}
			if (!count.permission) {
				getPermission.call(this);
			}
			if (!count.appInfo) {
				getAppInfo.call(this);
			}
		}
		const getMetrics = () => {
			appbaseService.getMetrics(appId, true).then((data) => {
				info.metrics = data;
				info.appStats = appbaseService.computeMetrics(data);
				apps[index].apiCalls = info.appStats.calls;
				apps[index].records = info.appStats.records;
				apps[index].lastAciveOn = null;
				apps[index].lastActiveDate = null;
				if (info.metrics.body && info.metrics.body.month && info.metrics.body.month.buckets) {
					const buckets = info.metrics.body.month.buckets;
					if (buckets[buckets.length - 1] && buckets[buckets.length - 1].key_as_string) {
						apps[index].lastAciveOn = buckets[buckets.length - 1].key_as_string;
						apps[index].lastActiveDate = buckets[buckets.length - 1].key;
					}
				}
				apps[index].info = info;
				count.metrics = true;
				cb.call(this);
			}).catch((e) => {
				console.log(e);
				apps[index].info = null;
				count.metrics = true;
			});
		}
		const getPermission = () => {
			appbaseService.getPermission(appId, true).then((data) => {
				apps[index].permissions = this.filterPermissions(data.body);
				count.permission = true;
				cb.call(this);
			}).catch((e) => {
				console.log(e);
				apps[index].info = null;
				count.metrics = true;
			});
		}
		const getAppInfo = () => {
			appbaseService.getAppInfo(appId, true).then((data) => {
				apps[index].appInfo = data.body;
				count.appInfo = true;
				cb.call(this);
			}).catch((e) => {
				console.log(e);
				apps[index].appInfo = null;
				count.appInfo = true;
			});
		}

		const cb = () => {
			if (count.permission && count.metrics && count.appInfo) {
				this.appsInfoCollected++;
			}
			if (this.appsInfoCollected === this.apps.length) {
				resolveApps(apps);
			}
		}
		init.call(this);
	}
	filterPermissions(permissions) {
		let permObj = {
			permissions: permissions
		};
		permissions.forEach((item) => {
			if (item.write) {
				permObj.writePermission = item;
			} else if (item.read) {
				permObj.readPermission = item;
			}
		});
		return permObj;
	}
	normalizaApps(apps) {
		let storeApps = [];
		Object.keys(apps).forEach((app, index) => {
			var obj = {
				name: app,
				id: apps[app]
			};
			storeApps[index] = obj;
		});
		return storeApps;
	}
	createApp(appName, apps) {
		return new Promise((resolve, reject) => {
			appbaseService.createApp(appName).then((data) => {
				apps.unshift({
					name: appName,
					id: data.body.id,
					lastAciveOn: new Date(),
					lastActiveDate: (new Date()).getTime()
				});
				resolve({
					createAppLoading: false,
					apps: apps,
					clearInput: true
				});
			}).catch((e) => {
				console.log(e);
				let error = null;
				try {
					error = JSON.parse(e.responseText);
				} catch (e) {}
				reject({
					createAppLoading: false,
					createAppError: error
				});
			});
		});
	}
}

class Common {
	compressNumber(amount) {
		let mAmount = amount;
		let finalNum = null;
		try {
			let unit = '';
			if (amount > 1000000) {
				unit = 'M';
			} else if (amount > 1000) {
				unit = 'K';
			}
			if (unit === 'M') {
				mAmount = parseFloat(amount / 1000000);
				mAmount = mAmount.toFixed(0);
			} else if (unit === 'K') {
				mAmount = parseFloat(amount / 1000);
				mAmount = mAmount.toFixed(0);
			} else {
				mAmount = amount;
			}
			finalNum = mAmount + unit;
		} catch (e) {
			console.log(e);
		}
		return finalNum;
	}
	keySummary() {
		return {
			'admin': 'Admin credentials',
			'read': 'Read credentials',
			'write': 'Write credentials'
		};
	}
	isDisabled(flag) {
		return flag ? { disabled: true } : null;
	}
	getPermission(permissions, role="admin") {
		const conditions = (permission) => {
			let flag =false;
			switch(role) {
				case "admin":
					flag = permission.read && permission.write;
				break;
				case "read":
					flag = permission.read;
				break;
				case "write":
					flag = permission.write;
				break;
			}
			return flag;
		}
		const perm = permissions.filter(permission => conditions(permission));
		return perm && perm.length ? perm[0] : null;
	}
}

class AjaxHttp {
	constructor() {
		$.ajaxSetup({
			crossDomain: true,
			xhrFields: {
				withCredentials: true
			}
		});
	}
	start(req) {
		let query = null;
		if (req) {
			query = new Promise((resolve, reject) => {
				req.method = req.method ? req.method : "GET";
				const requestObj = {
					url: req.url,
					type: req.method,
					contentType: "application/json",
					dataType: "json",
					success: (result) => {
						resolve(result);
					},
					error: (error) => {
						reject(error.responseJSON);
					}
				};
				if (req.data) {
					requestObj.data = JSON.stringify(req.data);
				}
				$.ajax(requestObj);
			});
		}
		return query;
	}
}

class IntercomService {
	loggingIn(userInfo) {
		window.Intercom('boot', {
			app_id: 'jnzcgdd7',
			email: userInfo.email
		});
	}
}

module.exports = {
	eventEmitter: eventEmitter,
	appDashboard: new AppDashboard(),
	appListHelper: new AppListHelper(),
	common: new Common(),
	$http: new AjaxHttp(),
	intercomService: new IntercomService()
}
