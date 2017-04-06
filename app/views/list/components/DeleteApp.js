import React,{ Component } from 'react';
import { Modal } from 'react-bootstrap';
import ConfirmBox from '../../../shared/ConfirmBox';
import ReactTooltip from 'react-tooltip';

export default class DeleteApp extends Component {
	constructor(props) {
		super(props);
		this.confirmBoxInfo = {
			title: (<span>Delete App</span>),
			description: (
				<p>
					Type the app name <strong>{this.props.app.appname}</strong> below to delete the app. This action cannot be undone.
				</p>
			),
			validate: {
				value: this.props.app.appname,
				placeholder: 'Type appname...'
			},
			buttons: {
				cancel: 'Go back',
				confirm: 'Confirm'
			}
		};
		this.deleteApp = this.deleteApp.bind(this);
	}
	deleteApp() {
		this.props.deleteApp(this.props.app);
	}
	render() {
		return (
			<ConfirmBox
				info={this.confirmBoxInfo}
				onConfirm={this.deleteApp}
				type="danger"
			>
				<button data-tip="Delete app" data-effect="solid" data-place="left" data-offset="{'top': 0, 'left': 0}" className="text-danger card-icon pointer">
					<i className="fa fa-trash"></i>
					<ReactTooltip />
				</button>
			</ConfirmBox>
		)
	}
}
