import React, { Component } from 'react';
import classNames from 'classnames';
import { appbaseService } from '../../service/AppbaseService';
import ConfirmBox from '../../shared/ConfirmBox';
import CopyToClipboard from '../../shared/CopyToClipboard';
import { common } from '../../shared/helper';
import { Types } from './utils';
import Description from './Description';

export default class PermissionCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			read: this.props.permissionInfo.read,
			write: this.props.permissionInfo.write,
			description: this.props.permissionInfo.description,
			credentials: `${this.props.permissionInfo.username}:${
				this.props.permissionInfo.password
			}`,
			showKey: false,
		};
		this.confirmBoxInfo = {
			title: <span>Delete Credentials</span>,
			description: (
				<p>
					This action will permanently <strong>delete</strong> the selected credentials.
					If these are the only credentials, you may lose access to other GUI views.
				</p>
			),
			buttons: {
				cancel: 'Go back',
				confirm: 'Confirm',
			},
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
			this.setState(
				{
					read: nextProps.permissionInfo.read,
					write: nextProps.permissionInfo.write,
					description: nextProps.permissionInfo.description,
					credentials: `${nextProps.permissionInfo.username}:${
						nextProps.permissionInfo.password
					}`,
				},
				this.setKeyType,
			);
		}
	}
	componentWillUnmount() {
		this.stopUpdate = true;
		if (this.cp) {
			this.cp.destroy();
		}
	}
	setKeyType() {
		this.setState({
			keyType: this.detectKey(),
		});
	}
	ccSuccess() {
		toastr.success(`${this.state.description} Credentials have been copied successully!`);
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
			.updatePermission(this.props.appId, this.props.permissionInfo.username, this.state)
			.then(data => {
				console.log(data);
			})
			.catch(e => {
				console.log(e);
			});
	}
	updatDescription(description) {
		this.setState(
			{
				description: description,
			},
			this.applyChange,
		);
	}
	deletePermission() {
		appbaseService
			.deletePermission(this.props.appId, this.props.permissionInfo.username)
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
	editCredentials = () => {
		const { permissionInfo, showForm } = this.props;
		let operationType = '';
		Object.keys(Types).every((k) => {
			const type = Types[k];
			if (type.read === permissionInfo.read && type.write === permissionInfo.write) {
				operationType = type;
				return false;
			}
			return true;
		});
		const formPayload = {
			description: permissionInfo.description,
			operationType,
			acl: permissionInfo.acl,
			referers: permissionInfo.referers,
			sources: permissionInfo.sources,
			include_fields: permissionInfo.include_fields,
			exclude_fields: permissionInfo.exclude_fields,
			ip_limit: permissionInfo.ip_limit,
			ttl: permissionInfo.ttl,
			meta: {
				username: permissionInfo.username,
			},
		};
		showForm(formPayload);
	}
	render() {
		const cx = classNames({
			active: this.state.showKey,
		});
		const lock = classNames({
			eye: !this.state.showKey,
			'eye-slash': this.state.showKey,
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
				<div className="permission-card-body col-xs-12">
					<div className="col-xs-12 col-sm-3 col-md-3 col-lg-5 permission-card-body-description">
						{this.keySummary[this.state.keyType]}
					</div>
					<div className="col-xs-12 col-sm-9 col-md-9 col-lg-7 permission-card-body-credential">
						<div className={`ad-permission-key ${cx}`}>
							<div className="ad-permission-key-value">{this.state.credentials}</div>
							<div className="ad-permission-key-buttons">
								<a
									className="ad-credential-btn ad-permission-key-lock-btn"
									key={lock}
									onClick={() => this.toggleKey()}
								>
									<i className={`fas fa-${lock}`} />
								</a>
								<CopyToClipboard
									type="danger"
									onSuccess={() => this.ccSuccess()}
									onError={() => this.ccError()}
								>
									<a
										className="ad-credential-btn ad-permission-key-copy-btn"
										data-clipboard-text={this.state.credentials}
									>
										<i className={`far fa-clone`} />
									</a>
								</CopyToClipboard>
								<a
									onClick={this.editCredentials}
									className="ad-credential-btn ad-permission-key-copy-btn"
								>
										<i className={`far fa-edit`} />
									</a>
							</div>
						</div>
						<aside className="permission-key-delete">
							<ConfirmBox
								info={this.confirmBoxInfo}
								onConfirm={this.deletePermission}
								type="danger"
							>
								<a className="permission-delete animation">
									<i className="fa fa-trash-alt" />
								</a>
							</ConfirmBox>
						</aside>
					</div>
				</div>
			</div>
		);
	}
}
