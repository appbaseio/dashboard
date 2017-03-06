const { EventEmitter } = require("fbemitter");
const eventEmitter = new EventEmitter();
import { appbaseService } from '../service/AppbaseService';

class AppDashboard {
	constructor() {}
	onEnter(activeApp, currentView) {
		eventEmitter.emit('activeApp', {
			activeApp,
			currentView
		});
	}
	onLeave() {
		eventEmitter.emit('activeApp', {
			activeApp: null
		});
	}
}

class AppListHelper {
	getAll(apps) {
		this.apps = apps;
		return new Promise((resolve, reject) => {
			this.appsInfoCollected = 0;
			apps.forEach((app, index) => {
				this.getInfo(app.id, index, cb);
				function cb(apps) {
					resolve(apps);
				}
			});
		});
	}
	getInfo(appId, index, resolveApps) {
		let apps = this.apps;
		let info = {};
		let count = {
			metrics: false,
			permission: false
		};
		appbaseService.getMetrics(appId).then((data) => {
			info.metrics = data;
			info.appStats = appbaseService.computeMetrics(data);
			apps[index].apiCalls = info.appStats.calls;
			apps[index].records = info.appStats.records;
			apps[index].lastAciveOn = null;
			apps[index].lastActiveDate = null;
			if(info.metrics.body && info.metrics.body.month && info.metrics.body.month.buckets) {
				const buckets = info.metrics.body.month.buckets;
				if(buckets[buckets.length-1] && buckets[buckets.length-1].key_as_string) {
					apps[index].lastAciveOn = buckets[buckets.length-1].key_as_string;
					apps[index].lastActiveDate = buckets[buckets.length-1].key;
				}
			}
			apps[index].info = info;
			count.metrics = true;
			cb.call(this);
		}).catch((e) => {
			console.log(e);
		});
		appbaseService.getPermission(appId, true).then((data) => {
			apps[index].permissions = {
				permissions: data.body
			};
			data.body.forEach((item) => {
				if(item.write) {
					apps[index].permissions.writePermission = item;
				}
				else if(item.read) {
					apps[index].permissions.readPermission = item;
				}
			});
			count.permission = true;
			cb.call(this);
		});

		function cb() {
			if(count.permission && count.metrics) {
				this.appsInfoCollected++;
			}
			if(this.appsInfoCollected === this.apps.length) {
				resolveApps(apps);
			}
		}
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
					id: data
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

class Comman {
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
}

module.exports = {
	eventEmitter: eventEmitter,
	appDashboard: new AppDashboard(),
	appListHelper: new AppListHelper(),
	comman: new Comman()
}