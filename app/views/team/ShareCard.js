import React, { Component } from 'react';
import classNames from "classnames";
import { appbaseService } from '../../service/AppbaseService';
import ConfirmBox from '../../shared/ConfirmBox';
import { comman } from '../../shared/helper';
import CopyToClipboard from '../../shared/CopyToClipboard';

export default class ShareCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			read: this.props.shareInfo.read,
			write: this.props.shareInfo.write,
			credentials: `${this.props.shareInfo.username}:${this.props.shareInfo.password}`,
			showKey: false
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
		this.keySummary = comman.keySummary();
		this.deleteShare = this.deleteShare.bind(this);
	}
	componentDidMount() {
		this.setKeyType();
	}
	componentWillReceiveProps(nextProps) {
		if(nextProps.shareInfo) {
			this.setState({
				read: nextProps.shareInfo.read,
				write: nextProps.shareInfo.write,
				credentials: `${nextProps.shareInfo.username}:${nextProps.shareInfo.password}`
			}, this.setKeyType);
		}
	}
	setKeyType() {
		this.setState({
			keyType: this.detectKey()
		});
	}
	ccSuccess() {
		toastr.success(`${this.props.shareInfo.email} Credentials has been copied successully!`);
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
			<div className="permission-card col-xs-12">
				<header className="permission-card-header col-xs-12">
					<summary className="col-xs-10">
						{this.props.shareInfo.email}
					</summary>
					<aside className="col-xs-2 text-right pull-right">
						<ConfirmBox
							info={this.confirmBoxInfo}
							onConfirm={this.deleteShare}
							type="danger"
						>
							<a className="ad-theme-btn danger-reverse permission-delete animation">
								<i className="fa fa-trash"></i>
							</a>
						</ConfirmBox>
					</aside>
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
								<CopyToClipboard onSuccess={() => this.ccSuccess()} onError={() => this.ccError()}>
									<a className="ad-theme-btn ad-permission-key-copy-btn"
										data-clipboard-text={this.state.credentials}>
										<i className={`fa fa-clone`}></i>
									</a>
								</CopyToClipboard>
							</div>
						</div>
					</div>
				</main>
			</div>
		);
	}
}