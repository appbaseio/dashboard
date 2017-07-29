import React, { Component } from 'react';
import { appbaseService } from '../../../service/AppbaseService';
import { common } from "../../../shared/helper";

export default class CloneApp extends Component {
	constructor(props) {
		super(props);
		this.state = {
			cloneAppLink: null
		};
		this.cloneApp = this.cloneApp.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.app && nextProps.app.permissions && nextProps.app.permissions.length) {
			const cloneAppLink = {
				platform: 'appbase',
				importFrom: {
					appname: nextProps.app.appname,
					hosturl: `https://${nextProps.app.permissions[0].username}:${nextProps.app.permissions[0].password}@scalr.api.appbase.io`
				}
			};
			this.setState({
				cloneAppLink: `https://opensource.appbase.io/dejavu/importer?app=${JSON.stringify(cloneAppLink)}`
				// cloneAppLink: `http://127.0.0.1:8000?app=${JSON.stringify(cloneAppLink)}`
			});
		}
	}
	cloneApp(event) {
		window.open(this.state.cloneAppLink, '_blank' );
		event.stopPropagation();
	}
	render() {
		return (
			<button onClick={this.cloneApp} {...common.isDisabled(!this.state.cloneAppLink)} className="ad-theme-btn-transparent ad-list-app-header-clone">
				<i className="fa fa-code-fork"></i>
			</button>
		)
	}
}