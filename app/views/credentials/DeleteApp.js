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
			browserHistory.push('/apps');
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
					<summary className="col-xs-10">
						Delete App
					</summary>
					<aside className="col-xs-2 text-right pull-right">
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
						Debitis soluta ex quia cum et facere temporibus similique harum maxime architecto, 
						quod quos veniam quaerat, minus eveniet eos magnam, reprehenderit corrupti.
					</div>
				</main>
			</div>
		);
	}
}
