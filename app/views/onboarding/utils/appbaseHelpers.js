import settings from './settings';
import mappingObj from './moviesMapping';
import moviesData from './data';
import url from './URL';

const streamingData = {
    "genres": "Action",
    "homepage": "https://www.imdb.com/title/tt2527336/",
    "imdb_id": "tt2527336",
    "total_revenue": "1.1B",
    "original_language": "English",
    "original_title": "Star Wars: The Last Jedi",
    "overview": "Rey develops her newly discovered abilities with the guidance of Luke Skywalker, who is unsettled by the strength of her powers. Meanwhile, the Resistance prepares to do battle with the First Order.",
    "popularity": 600.345,
    "poster_path": "/kOVEVeg59E0wsnXmF9nrh6OmWII.jpg",
    "revenue_string": "1.3B",
    "release_year": 2017,
    "revenue": 1325937250,
    "score": 600.48,
    "tagline": "Episode VIII - The Last Jedi",
    "vote_average": 7.4
};

class AppbaseUtils {
	constructor() {
		this.user = null;
		this.app = null;
		this.accountAddress = 'https://accapi.appbase.io/';
		this.address = 'https://scalr.api.appbase.io/';
	}

	getApp = () => {
		return this.app ? this.app.id : '';
	}

	getUser() {
		return fetch(`${this.accountAddress}user`, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'content-type': 'application/json'
			},
		});
	}

	logout() {
		return fetch(`${this.accountAddress}logout?next=`, {
			method: 'GET',
			credentials: 'include',
			headers: {
				'content-type': 'application/json'
			},
		});
	}

	getWritePermissions() {
		const appId = this.getApp();
		return new Promise((resolve, reject) => {
			fetch(`${this.accountAddress}app/${appId}/permissions`, {
				method: 'GET',
				credentials: 'include',
				headers: {
					'content-type': 'application/json'
				},
			})
				.then(res => res.json())
				.then((data) => {
					const permissions = data.body.filter(permission => permission.read && permission.write);
					resolve(permissions[0]);
				})
				.catch(e => {
					reject(e);
				});
		});
	}

	createApp(appname) {
		return fetch(`${this.accountAddress}app/${appname}`, {
			method: 'PUT',
			credentials: 'include',
			headers: {
				'content-type': 'application/json'
			},
		});
	}

	applyAnalyzers = () => {
		const { appName } = this.app;
		const credentials = this.app.username + ':' + this.app.password;

		return new Promise((resolve, reject) => {
			fetch(`${this.address}${appName}/_close`, {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Authorization': 'Basic ' + btoa(credentials),
					'content-type': 'application/json'
				},
			})
				.then(() => {
					fetch(`${this.address}${appName}/_settings`, {
						method: 'PUT',
						credentials: 'include',
						headers: {
							'Authorization': 'Basic ' + btoa(credentials),
							'content-type': 'application/json'
						},
						body: JSON.stringify(settings)
					})
						.then(() => {
							fetch(`${this.address}${appName}/_open`, {
								method: 'POST',
								credentials: 'include',
								headers: {
									'Authorization': 'Basic ' + btoa(credentials),
									'content-type': 'application/json'
								},
							})
								.then(() => {
									resolve();
								})
						})
				})
				.catch(e => {
					reject(e);
				})
		})
	}

	updateUser = (user) => {
		this.user = user;
	}

	updateApp = (app) => {
		this.app = app;
	}

	updateMapping = () => {
		const type = 'movies';
		const credentials = this.app.username + ':' + this.app.password;
		this.app.type = type;

		return fetch(`${this.address}${this.app.appName}/_mapping/${type}?update_all_types=true`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Authorization': 'Basic ' + btoa(credentials),
				'content-type': 'application/json'
			},
			body: JSON.stringify(mappingObj)
		});
	}

	indexData = () => {
		const credentials = this.app.username + ':' + this.app.password;
		const finalData = [];
		const indexObj = {
			index: {}
		};
		moviesData.forEach((record) => {
			finalData.push(indexObj);
			finalData.push(record);
		});
		const appbaseRef = new Appbase({
			"url": this.address,
			"appname": this.app.appName,
			"username": this.app.username,
			"password": this.app.password
		});
		return new Promise((resolve, reject) => {
			appbaseRef.bulk({
				type: this.app.type,
				body: finalData
			})
				.on('data', () => {
					resolve();
				})
				.on('error', (e) => {
					reject(e);
				});
		});
	}

	appConfig = () => {
		return {
			"app": this.app.appName,
			"credentials": `${this.app.username}:${this.app.password}`,
			"type": this.app.type
		};
	}

	createURL(cb) {
		const obj = {
			url: 'https://' + this.app.username + ':' + this.app.password + '@scalr.api.appbase.io',
			appname: this.app.appName,
			version: '5.0.0'
		};
		if (this.app.type) {
			obj.selectedType = [this.app.type];
			obj.selectedTypes = [this.app.type];
		}
		url.setInputs(obj, cb);
	}
}

const appbaseHelpers = new AppbaseUtils();
export default appbaseHelpers;
