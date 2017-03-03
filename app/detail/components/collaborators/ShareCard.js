import React, { Component } from 'react';
import { appbaseService } from '../../../service/AppbaseService';
import ConfirmBox from '../../../shared/ConfirmBox';

export default class ShareCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			read: this.props.shareInfo.read,
			write: this.props.shareInfo.write
		};
		this.confirmBoxInfo = {
			title: (<span>Delete Email?</span>),
			description: (
				<p>
					Are you sure you want to delete {this.props.shareInfo.email}?
				</p>
			),
			buttons: {
				cancel: 'Cancel',
				confirm: 'Yes'
			}
		};
		this.deleteShare = this.deleteShare.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		if(nextProps.shareInfo) {
			this.setState({
				read: nextProps.shareInfo.read,
				write: nextProps.shareInfo.write
			});
		}
	}
	changePermission(method) {
		this.setState({
			[method]: !this.state[method]
		}, this.applyChange);
	}
	applyChange() {
		appbaseService.updateShare(this.props.appId, this.props.shareInfo, this.state).then((data) => {
			this.props.getInfo();
		}).catch((e) => {
			console.log(e);
		});
	}
	deleteShare() {
		const obj = {
			email: this.props.shareInfo.email
		};
		appbaseService.deleteShare(this.props.appId, this.props.shareInfo.username, obj).then((data) => {
			this.props.getInfo();
		}).catch((e) => {
			console.log(e);
		});
	}
	render() {
		return (
			<div className="app-card permissionView col-xs-12">
				<div className="col-xs-12 permission-row">
					<span className="key">User:&nbsp;</span>
					<span className="value permission-username">{this.props.shareInfo.email}</span>
				</div>
				<div className="col-xs-12 permission-row">
					<span className="key">Key:&nbsp;</span>
					<span className="value permission-username">{this.props.shareInfo.username}:{this.props.shareInfo.password}</span>
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
					onConfirm={this.deleteShare} >
					<a className="delete-permission text-danger">
						<i className="fa fa-trash"></i>
					</a>
				</ConfirmBox>
			</div>
		);
	}
}