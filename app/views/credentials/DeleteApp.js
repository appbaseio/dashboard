import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { appbaseService } from '../../service/AppbaseService';
import ConfirmBox from '../../shared/ConfirmBox';

export default class DeleteApp extends Component {
	constructor(props) {
		super(props);
		this.confirmBoxInfo = {
			title: (<span>Delete App</span>),
			description: (
				<p>
					Type the app name <strong>{this.props.appName}</strong> below to delete the app. This action cannot be undone.
				</p>
			),
			validate: {
				value: this.props.appName,
				placeholder: 'Type app name'
			},
			buttons: {
				cancel: 'Go back',
				confirm: 'Confirm'
			}
		};
		this.deleteApp = this.deleteApp.bind(this);
	}
	deleteApp() {
		appbaseService.deleteApp(this.props.appId).then((data) => {
			appbaseService.pushUrl('/apps');
		}).catch((e) => {
			console.log(e);
		})
	}
	componentWillUnmount() {
		this.stopUpdate = true;
	}
	render() {
		return (
			<div className="permission-card delete-card delete-active col-xs-12">
				<header className="permission-card-header col-xs-12 delete-title">
					<summary className="">
						<ConfirmBox
							info={this.confirmBoxInfo}
							onConfirm={this.deleteApp}
							type="danger"
						>
							<a className="ad-theme-btn danger-inverse permission-delete">
								<i className="fa fa-exclamation-triangle"></i>&nbsp;&nbsp;Delete this app
							</a>
						</ConfirmBox>
					</summary>
					<aside className="permission-card-body">
						<span className="permission-delete-card-description">
						Deleting an app is a permanent action, and will delete all the associated data, credentials and team sharing settings.
						</span>
					</aside>
				</header>
			</div>
		);
	}
}
