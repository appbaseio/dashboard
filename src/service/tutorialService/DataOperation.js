import { sampleCodeSnippet } from './SampleCodeSnippet';

class DataOperation {
	constructor() {
		this.user = null;
		// this.app = null;
		this.app = {
			appName: 'ReactTestApp3',
			username: 'CR1KCtfUY',
			password: 'a5aaebbe-c734-43e5-89dc-76d0f37689eb',
			type: 'test',
		};
		$.ajaxSetup({
			crossDomain: true,
			xhrFields: {
				withCredentials: true,
			},
		});
		this.sampleCodeSnippet = sampleCodeSnippet;
	}
	getUser() {
		return $.ajax({
			type: 'GET',
			url: 'https://accapi.appbase.io/user',
			dataType: 'json',
			contentType: 'application/json',
		});
	}
	logout() {
		return $.ajax({
			type: 'GET',
			url: 'https://accapi.appbase.io/logout?next=',
			dataType: 'json',
			contentType: 'application/json',
		});
	}
	createApp(appname) {
		return $.ajax({
			type: 'PUT',
			url: `https://accapi.appbase.io/app/${appname}`,
			dataType: 'json',
			contentType: 'application/json',
		});
	}
	updateUser(user) {
		this.user = user;
	}
	updateApp(app) {
		this.app = app;
	}
	readMapping(type) {
		const credentials = `${this.app.username}:${this.app.password}`;
		this.app.type = type;
		return $.ajax({
			type: 'GET',
			url: `https://scalr.api.appbase.io/${this.app.appName}/_mapping/`,
			dataType: 'json',
			contentType: 'application/json',
			headers: {
				Authorization: `Basic ${btoa(credentials)}`,
			},
		});
	}
	updateMapping(type, mappingObj) {
		const credentials = `${this.app.username}:${this.app.password}`;
		this.app.type = type;
		return $.ajax({
			type: 'PUT',
			url: `https://scalr.api.appbase.io/${
				this.app.appName
			}/_mapping/${type}?ignore_conflicts=true&update_all_types=true`,
			dataType: 'json',
			contentType: 'application/json',
			headers: {
				Authorization: `Basic ${btoa(credentials)}`,
			},
			data: JSON.stringify(mappingObj),
		});
	}
	indexData(data) {
		const credentials = `${this.app.username}:${this.app.password}`;
		const finalData = [];
		data.forEach(record => {
			const indexObj = {
				index: {},
			};
			finalData.push(indexObj);
			finalData.push(record);
		});
		const appbaseRef = new Appbase({
			url: 'https://scalr.api.appbase.io',
			appname: this.app.appName,
			username: this.app.username,
			password: this.app.password,
		});
		return appbaseRef.bulk({
			type: this.app.type,
			body: finalData,
		});
	}
	createUrl(cb) {
		const obj = {
			url: `https://${this.app.username}:${this.app.password}@scalr.api.appbase.io`,
			appname: this.app.appName,
			version: '2.4.0',
		};
		if (this.app.type) {
			obj.selectedType = [this.app.type];
			obj.selectedTypes = [this.app.type];
		}
		const URL = JSON.stringify(obj);
		cb(URL);
	}
	appConfig() {
		const app = this.app ? this.app : this.defaultApp;
		return {
			appname: app.appName,
			username: app.username,
			password: app.password,
			type: app.type,
		};
	}
	htmlSnippet(method) {
		const min_html = '<div id="root"></div>';
		const max_html = `<!doctype html>
<html>

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="shortcut icon" href="assets/images/favicon.ico" />
	<title>Reactive maps sample</title>
	<!-- CSS -->
	<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" />
	<link rel="stylesheet" type="text/css" href="https://rawgit.com/appbaseio/reactivemaps/umd-test/dist/css/style.min.css" />
	<!-- JavaScript -->
	<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/react/15.3.1/react.min.js"></script>
	<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/react/15.3.1/react-dom.min.js"></script>
	<script type="text/javascript" src="https://maps.google.com/maps/api/js?key=AIzaSyC-v0oz7Pay_ltypZbKasABXGiY9NlpCIY&libraries=places"></script>
	<script type="text/javascript" src="https://rawgit.com/appbaseio/reactivemaps/0.1.4/umd/ReactiveMaps.js"></script>
</head>
<body>
	<div id="root"></div>
</body>

</html>`;

		if (method === 'full') {
			return max_html;
		}
		return min_html;
	}
	resources() {
		const resources = [
			'https://cdnjs.cloudflare.com/ajax/libs/react/15.3.1/react.min.js',
			'https://cdnjs.cloudflare.com/ajax/libs/react/15.3.1/react-dom.min.js',
			'https://maps.google.com/maps/api/js?key=AIzaSyC-v0oz7Pay_ltypZbKasABXGiY9NlpCIY&libraries=places',
			'https://rawgit.com/appbaseio/reactivemaps/0.1.4/umd/ReactiveMaps.js',
			'https://rawgit.com/appbaseio/reactivemaps/umd-test/dist/css/style.min.css',
			'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
		];
		return resources.join(',');
	}
	appSnippet() {
		const obj = this.appConfig();
		return this.sampleCodeSnippet.replace('{{appbaseConfig}}', JSON.stringify(obj, null, 4));
	}
}

export const dataOperation = new DataOperation();
