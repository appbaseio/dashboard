import React, { Component } from 'react';
import { appbaseService } from '../../service/AppbaseService';
import ConfirmBox from '../../others/ConfirmBox';
import Description from './Description';

export default class PermissionCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			read: this.props.permissionInfo.read,
			write: this.props.permissionInfo.write,
			description: this.props.permissionInfo.description
		};
		this.confirmBoxInfo = {
			title: (<span>Delete Permission?</span>),
			description: (
				<p>
					Do you want to permanently delete this credential?
					If this is the only credential, you will lose access to the app.
				</p>
			),
			buttons: {
				cancel: 'Cancel',
				confirm: 'Yes'
			}
		};
		this.updatDescription = this.updatDescription.bind(this);
		this.deletePermission = this.deletePermission.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		if(nextProps.permissionInfo) {
			this.setState({
				read: nextProps.permissionInfo.read,
				write: nextProps.permissionInfo.write,
				description: nextProps.permissionInfo.description
			});
		}
	}
	changePermission(method) {
		this.setState({
			[method]: !this.state[method]
		}, this.applyChange);
	}
	applyChange() {
		appbaseService.updatePermission(this.props.appId, this.props.permissionInfo.username, this.state).then((data) => {
			console.log(data);
		}).catch((e) => {
			console.log(e);
		});
	}
	updatDescription(description) {
		this.setState({
			description: description
		}, this.applyChange);
	}
	deletePermission() {
		appbaseService.deletePermission(this.props.appId, this.props.permissionInfo.username).then((data) => {
			this.props.getInfo();
		}).catch((e) => {
			console.log(e);
		});
	}
	render() {
		return (
			<div className="app-card permissionView col-xs-12">
				<Description 
					description={this.state.description} 
					updatDescription={this.updatDescription} />
				<div className="col-xs-12 permission-row">
					<span className="key">Key:&nbsp;</span>
					<span className="value permission-username">{this.props.permissionInfo.username}:{this.props.permissionInfo.password}</span>
				</div>
				<div className="col-xs-12 permission-row">
					<span className="checkbox">
						<label>
							<input type="checkbox" checked={this.state.read} onChange={() => this.changePermission('read')} /> R
						</label>
					</span>
					<span className="checkbox">
						<label>
							<input type="checkbox" checked={this.state.write} onChange={() => this.changePermission('write')} /> W
						</label>
					</span>
				</div>
				<ConfirmBox
					info={this.confirmBoxInfo}
					onConfirm={this.deletePermission} >
					<a className="delete-permission text-danger">
						<i className="fa fa-trash"></i>
					</a>
				</ConfirmBox>
			</div>
		);
	}
}