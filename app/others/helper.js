const { EventEmitter } = require("fbemitter");
const eventEmitter = new EventEmitter();

class AppDashboard {
	constructor() {}
	onEnter(appId) {
		eventEmitter.emit('activeApp', {
			activeApp: appId
		});
	}
	onLeave() {
		eventEmitter.emit('activeApp', null);
	}
}

module.exports = {
	eventEmitter: eventEmitter,
	appDashboard: new AppDashboard()
}