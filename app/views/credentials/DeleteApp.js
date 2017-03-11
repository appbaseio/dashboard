import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { appbaseService } from '../../service/AppbaseService';
import ConfirmBox from '../../shared/ConfirmBox';

export default class DeleteApp extends Component {
	constructor(props) {
		super(props);
		this.confirmBoxInfo = {
			title: (<span>Delete App?</span>),
			description: (
				<p>
					Are you sure you want to delete <strong>{this.props.appName}</strong>?
				</p>
			),
			validate: {
				value: this.props.appName,
				placeholder: 'Type appname...'
			},
			buttons: {
				cancel: 'Cancel',
				confirm: 'Yes'
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
				<header className="permission-card-header col-xs-12">
					<summary className="col-xs-12 col-sm-6">
						Delete App
					</summary>
					<aside className="col-xs-12 col-sm-6 text-right pull-right">
						<ConfirmBox
							info={this.confirmBoxInfo}
							onConfirm={this.deleteApp}
							type="danger"
						>
							<a className="ad-theme-btn danger permission-delete">
								<i className="fa fa-trash"></i>&nbsp;&nbsp;Delete App
							</a>
						</ConfirmBox>
					</aside>
				</header>
				<main className="permission-card-body col-xs-12">
					<div className="col-xs-12 col-sm-6 permission-card-body-description">
						Lorem ipsum dolor sit amet, consectetur adipisicing elit.
					</div>
				</main>
			</div>
		);
	}
}
