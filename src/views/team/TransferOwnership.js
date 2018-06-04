import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import ConfirmBox from '../../shared/ConfirmBox';
import { appbaseService } from '../../service/AppbaseService';
import { Loading } from '../../shared/SharedComponents';

export default class TransferOwnership extends Component {
	constructor(props) {
		super(props);
		this.state = {
			allowInput: false,
			ownershipEmail: '',
			error: null,
			confirmChange: false,
			loading: false,
		};
		this.confirmOwnership = this.confirmOwnership.bind(this);
		this.toggleOwnership = this.toggleOwnership.bind(this);
		this.ownershipUpdate = this.ownershipUpdate.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	confirmOwnership() {
		this.loading(true);
		appbaseService
			.transferOwnership(this.props.appId, { owner: this.state.ownershipEmail })
			.then(data => {
				this.loading(false);
				appbaseService.pushUrl('/app');
			});
	}
	loading(loading) {
		this.setState({
			loading,
		});
	}
	toggleOwnership() {
		this.setState({
			allowInput: !this.state.allowInput,
		});
	}
	ownershipUpdate(event) {
		this.setState({
			ownershipEmail: event.target.value,
		});
	}
	validateEmail() {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(this.state.ownershipEmail);
	}
	handleSubmit(event) {
		event.preventDefault();
		if (this.validateEmail()) {
			this.setState({
				confirmChange: true,
				error: false,
			});
		} else {
			this.setState({
				error: 'This e-mail does not seem correct.',
			});
		}
	}
	confirmBoxInfo() {
		return {
			title: <span>Transfer ownership</span>,
			description: (
				<p>
					Type the app name <strong>{this.props.appName}</strong> below to transfer its
					ownership to <i>{this.state.ownershipEmail}</i>. This action is final and cannot
					be undone.
				</p>
			),
			validate: {
				value: this.props.appName,
				placeholder: 'Type appname...',
			},
			buttons: {
				cancel: 'Go back',
				confirm: 'Confirm',
			},
		};
	}
	render() {
		const confirmModal = (
			<ConfirmBox
				info={this.confirmBoxInfo()}
				onConfirm={this.confirmOwnership}
				type="danger"
				showModal={true}
			/>
		);
		const ownershipButton = (
			<button className="ad-theme-btn danger-inverse warning" onClick={this.toggleOwnership}>
				Transfer App Ownership
			</button>
		);
		const ownershipForm = (
			<form onSubmit={this.handleSubmit} className="form-inline" noValidate>
				{this.state.loading && <Loading />}
				<div className="form-group pull-left">
					<input
						type="email"
						value={this.state.ownershipEmail}
						onChange={this.ownershipUpdate}
						className="form-control"
						id="ownershipEmail"
						placeholder="Type valid email"
					/>
				</div>
				<span className=" pull-left">
					<button type="submit" className="ad-theme-btn danger-inverse warning">
						Transfer
					</button>
					<button className="ad-theme-btn" onClick={this.toggleOwnership}>
						Go back
					</button>
				</span>
			</form>
		);
		return (
			<div className="ad-change-ownership col-xs-12">
				{this.state.allowInput ? ownershipForm : ownershipButton}
				{this.state.error && <div className="text-danger">{this.state.error}</div>}
				{this.state.confirmChange && confirmModal}
			</div>
		);
	}
}
