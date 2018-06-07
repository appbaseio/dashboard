import React, { Component } from 'react';
import ConfirmBox from '../../../shared/ConfirmBox';

export default class DeleteApp extends Component {
	constructor(props) {
		super(props);
		this.confirmBoxInfo = {
			title: <span>Delete App</span>,
			description: (
				<p>
					Type the app name <strong>{this.props.app.appname}</strong> below to delete the
					app. This action cannot be undone.
				</p>
			),
			validate: {
				value: this.props.app.appname,
				placeholder: 'Type appname...',
			},
			buttons: {
				cancel: 'Go back',
				confirm: 'Confirm',
			},
		};
		this.deleteApp = this.deleteApp.bind(this);
		this.setAside = this.setAside.bind(this);
	}
	deleteApp() {
		this.props.deleteApp(this.props.app);
	}
	setAside() {
		$('.ad-list-app-content aside').hide();
		setTimeout(() => {
			$('.ad-list-app-content aside').show();
		}, 1000);
	}
	render() {
		return (
			<ConfirmBox
				info={this.confirmBoxInfo}
				onConfirm={this.deleteApp}
				type="danger"
				onClose={this.setAside}
			>
				<button
					aria-label="Delete app"
					data-effect="solid"
					data-place="left"
					data-offset="{'top': 0, 'left': 0}"
					className="card-icon pointer"
				>
					<i className="fas fa-trash-alt" />
				</button>
			</ConfirmBox>
		);
	}
}
