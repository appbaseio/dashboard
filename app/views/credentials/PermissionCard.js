import React, { Component } from 'react';
import classNames from "classnames";
import { appbaseService } from '../../service/AppbaseService';
import ConfirmBox from '../../shared/ConfirmBox';
import CopyToClipboard from '../../shared/CopyToClipboard';
import { common } from '../../shared/helper';
import Description from './Description';

export default class PermissionCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			read: this.props.permissionInfo.read,
			write: this.props.permissionInfo.write,
			description: this.props.permissionInfo.description,
			credentials: `${this.props.permissionInfo.username}:${this.props.permissionInfo.password}`,
			showKey: false
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
		this.keySummary = common.keySummary();
		this.updatDescription = this.updatDescription.bind(this);
		this.deletePermission = this.deletePermission.bind(this);
	}
	componentDidMount() {
		this.setKeyType();
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.permissionInfo) {
			this.setState({
				read: nextProps.permissionInfo.read,
				write: nextProps.permissionInfo.write,
				description: nextProps.permissionInfo.description,
				credentials: `${nextProps.permissionInfo.username}:${nextProps.permissionInfo.password}`
			}, this.setKeyType);
		}
	}
	componentWillUnmount() {
		this.stopUpdate = true;
		if(this.cp) {
			this.cp.destroy();
		}
	}
	setKeyType() {
		this.setState({
			keyType: this.detectKey()
		});
	}
	ccSuccess() {
		toastr.success(`${this.state.description} Credentials have been copied successully!`);
		if (this.state.keyType === 'admin') {
			toastr.warning('The copied credentials can modify data in your app, do not use them in code that runs in the web browser. Instead, generate <a href="guide-link">read-only credentials</a>.');
		}
	}
	ccError() {
		toastr.error('Error', e);
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
	toggleKey() {
		this.setState({
			showKey: !this.state.showKey
		});
	}
	detectKey() {
		let keyType = null;
		if (this.state.read && this.state.write) {
			keyType = 'admin';
		} else if (this.state.read) {
			keyType = 'read';
		} else if (this.state.write) {
			keyType = 'write';
		}
		return keyType;
	}
	render() {
		const cx = classNames({
			"active": this.state.showKey
		});
		const lock = classNames({
			"lock": !this.state.showKey,
			"unlock-alt": this.state.showKey
		});
		return (
			<div className="permission-card col-xs-12 p-0">
				<header className="permission-card-header col-xs-12">
					<summary className="col-xs-10 p-0">
						<Description
							description={this.state.description}
							updatDescription={this.updatDescription}
						/>
					</summary>
				</header>
				<main className="permission-card-body col-xs-12">
					<div className="col-xs-12 col-sm-6 permission-card-body-description">
						{this.keySummary[this.state.keyType]}
					</div>
					<div className="col-xs-12 col-sm-6 permission-card-body-credential">
						<div className={`ad-permission-key ${cx}`}>
							<div className="ad-permission-key-value">
								{this.state.credentials}
							</div>
							<div className="ad-permission-key-buttons">
								<a className="ad-theme-btn ad-permission-key-lock-btn" onClick={() => this.toggleKey()}>
									<i className={`fa fa-${lock}`}></i>
								</a>
								<CopyToClipboard type="danger" onSuccess={() => this.ccSuccess()} onError={() => this.ccError()}>
									<a className="ad-theme-btn ad-permission-key-copy-btn"
										data-clipboard-text={this.state.credentials}>
										<i className={`fa fa-clone`}></i>
									</a>
								</CopyToClipboard>
							</div>
						</div>
						<aside className="permission-key-delete">
							<ConfirmBox
								info={this.confirmBoxInfo}
								onConfirm={this.deletePermission}
								type="danger" >
								<a className="ad-theme-btn danger-reverse permission-delete animation">
									<i className="fa fa-trash"></i>
								</a>
							</ConfirmBox>
						</aside>
					</div>
				</main>
			</div>
		);
	}
}
