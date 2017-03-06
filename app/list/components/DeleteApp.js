import React,{ Component } from 'react';
import { Modal } from 'react-bootstrap';
import ConfirmBox from '../../shared/ConfirmBox';

export default class DeleteApp extends Component {
	constructor(props) {
		super(props);
		this.confirmBoxInfo = {
			title: (<span>Delete App?</span>),
			description: (
				<p>
					Are you sure you want to delete <strong>{this.props.app.name}</strong>?
				</p>
			),
			buttons: {
				cancel: 'Cancel',
				confirm: 'Yes'
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
				<a className="ad-theme-btn danger-reverse permission-delete animation">
					<i className="fa fa-trash"></i>
				</a>
			</ConfirmBox>
		)
	}
}
