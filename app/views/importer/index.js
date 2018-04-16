import React, { Component } from 'react';
import { Link } from 'react-router';
import { appbaseService } from '../../service/AppbaseService';
import ConfirmBox from '../../shared/ConfirmBox';

export default class Importer extends Component {
	constructor(props) {
		super(props);
		this.importerUrl = "https://importer.appbase.io/?header=false";
		this.confirmInfo = {
			title: "Switch to Dashboard",
			description: (<p> Do you want to abort the import process and go back to the dashboard? The current progress will not be saved.</p>),
			buttons: {
				confirm: "Confirm"
			}
		}
	}
	componentDidMount() {
		this.handleLogout();
		if (this.props.directImporter) {
			this.open();
		}
	}
	handleLogout() {
		window.addEventListener("message", this.onLogout.bind(this), false);
	}
	onLogout(params) {
		setTimeout(function() {
			if (params.data === "loggedOut") {
				this.close();
			}
		}.bind(this), 1000);
	}
	close() {
		appbaseService.pushUrl('/apps');
	}
	getImporterUrl() {
		let importerUrl = this.importerUrl;
		if(appbaseService.importerConfig) {
			const config = Object.assign(appbaseService.importerConfig, { platform: "appbase" });
			importerUrl = `${importerUrl}&app=${JSON.stringify(config)}`;
			appbaseService.importerApp = null;
		}
		return importerUrl;
	}
	render() {
		return (
			<div className="ad-importer">
				<iframe src={this.getImporterUrl()} frameBorder="0" className="ad-importer-iframe" />
				<ConfirmBox
					info={this.confirmInfo}
					onConfirm={this.close}
					type="danger"
				>
					<a title="back" className="ad-theme-btn danger transparent ad-importer-close">
						Switch to Dashboard
					</a>
				</ConfirmBox>
			</div>
		);
	}

}
