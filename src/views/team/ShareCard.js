import React, { Component } from 'react';
import classNames from 'classnames';
import { appbaseService } from '../../service/AppbaseService';
import ConfirmBox from '../../shared/ConfirmBox';
import { common } from '../../shared/helper';
import CopyToClipboard from '../../shared/CopyToClipboard';

export default class ShareCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			read: this.props.shareInfo.read,
			write: this.props.shareInfo.write,
			credentials: `${this.props.shareInfo.username}:${this.props.shareInfo.password}`,
			showKey: false,
		};
		this.confirmBoxInfo = {
			title: <span>Remove user access</span>,
			description: (
				<p>
					This will remove all app access from the user with e-mail{' '}
					<strong>{this.props.shareInfo.email}</strong>. They will no longer be able to
					use their shared credentials.
				</p>
			),
			buttons: {
				cancel: 'Go back',
				confirm: 'Confirm',
			},
		};
		this.keySummary = common.keySummary();
		this.deleteShare = this.deleteShare.bind(this);
	}
	componentDidMount() {
		this.setKeyType();
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.shareInfo) {
			this.setState(
				{
					read: nextProps.shareInfo.read,
					write: nextProps.shareInfo.write,
					credentials: `${nextProps.shareInfo.username}:${nextProps.shareInfo.password}`,
				},
				this.setKeyType,
			);
		}
	}
	setKeyType() {
		this.setState({
			keyType: this.detectKey(),
		});
	}
	ccSuccess() {
		toastr.success(`${this.props.shareInfo.email} Credentials has been copied successully!`);
		if (this.state.keyType === 'admin') {
			toastr.warning(
				'The copied credentials can modify data in your app, do not use them in code that runs in the web browser. Instead, generate <a href="guide-link">read-only credentials</a>.',
			);
		}
	}
	ccError() {
		toastr.error('Error', e);
	}
	changePermission(method) {
		this.setState(
			{
				[method]: !this.state[method],
			},
			this.applyChange,
		);
	}
	applyChange() {
		appbaseService
			.updateShare(this.props.appId, this.props.shareInfo, this.state)
			.then(data => {
				this.props.getInfo();
			})
			.catch(e => {
				console.log(e);
			});
	}
	deleteShare() {
		const obj = {
			email: this.props.shareInfo.email,
		};
		appbaseService
			.deleteShare(this.props.appId, this.props.shareInfo.username, obj)
			.then(data => {
				this.props.getInfo();
			})
			.catch(e => {
				console.log(e);
			});
	}
	toggleKey() {
		this.setState({
			showKey: !this.state.showKey,
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
			active: this.state.showKey,
		});
		const lock = classNames({
			lock: !this.state.showKey,
			'unlock-alt': this.state.showKey,
		});
		return (
			<div className="permission-card col-xs-12">
				<header className="permission-card-header col-xs-10 col-sm-12">
					<summary className="col-xs-8 col-sm-10">
						<span className="permission-card-title">{this.props.shareInfo.email}</span>
						<span className="permission-card-header-description">
							({this.keySummary[this.state.keyType]})
						</span>
					</summary>
					<aside className="permission-key-delete col-xs-2 pull-right text-right">
						<ConfirmBox
							info={this.confirmBoxInfo}
							onConfirm={this.deleteShare}
							type="danger"
						>
							<a className="ad-theme-btn danger-reverse permission-delete animation">
								<i className="fa fa-trash" />
							</a>
						</ConfirmBox>
					</aside>
				</header>
			</div>
		);
	}
}
