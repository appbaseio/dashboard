import React, { Component } from 'react';

export default class NewShare extends Component {
	constructor(props) {
		super(props);
		this.state = {
			show: false,
			userEmail: null
		};
		this.types = {
			read: {
				description: "Read only key",
				read: true,
				write: false
			},
			write: {
				description: "Write only key",
				read: false,
				write: true
			},
			admin: {
				description: "Admin key",
				read: true,
				write: true
			}
		};
		this.newShare = this.newShare.bind(this);
		this.exapand = this.exapand.bind(this);
		this.updateUserEmail = this.updateUserEmail.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.description) {
			this.setState({
				description: this.props.description
			});
		}
	}
	newShare(type) {
		const request = this.types[type];
		request.email = this.state.userEmail;
		request.user = this.state.userEmail;
		request.description += '(shared with '+this.state.userEmail+')';
		this.props.newShare(request);
		this.exapand();
	}
	exapand() {
		this.setState({
			show: !this.state.show
		});
	}
	updateUserEmail(email) {
		if (email !== this.state.userEmail) {
			this.setState({
				userEmail: email
			});
		}
	}
	renderElement(method) {
		let element = null;
		switch (method) {
			case 'buttonGroup':
				if (this.state.show) {
					element = (
						<div className="row">
							<div className="col-xs-12">
								<UserEmail updateUserEmail={this.updateUserEmail} />
							</div>
							<div className="description-show col-xs-12">
								{
									Object.keys(this.types).map((type, index) => {
										return (
											<ShareButton 
												key={index}
												type={type} 
												description={this.types[type].description} 
												onAction={this.newShare}
												userEmail={this.state.userEmail}
											/>
										);
									})
								}
							</div>
						</div>
					);
				}
				break;
		}
		return element;
	}
	render() {
		return (
			<div className="permission-description col-xs-12">
				<a className="btn btn-primary" onClick={this.exapand}>
					Share app
				</a>
				{this.renderElement('buttonGroup')}
			</div>
		);
	}
}

class UserEmail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			userEmail: null
		};
		this.handleInput = this.handleInput.bind(this);
	}
	handleInput(event) {
		this.setState({
			userEmail: event.target.value
		}, this.validateEmail);
	}
	validateEmail() {
		if (this.isValidEmail(this.state.userEmail)) {
			this.props.updateUserEmail(this.state.userEmail);
		} else {
			this.props.updateUserEmail(null);
		}
	}
	isValidEmail(email) {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	}
	render() {
		return (
			<input type="text" placeholder="Type email.." className="form-control" defaultValue={this.state.userEmail} onChange={this.handleInput} />
		);
	}
};

const ShareButton = (props) => {
	let disabled = null;
	if (!props.userEmail) {
		disabled = { disabled: true };
	}
	return (
		<button className={`btn btn-success`} {...disabled} onClick={props.onAction && (() => props.onAction(props.type))}>
			{props.description}
		</button>
	);
};
