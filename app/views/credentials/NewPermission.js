import React, { Component } from 'react';
import classNames from "classnames";

export default class NewPermission extends Component {
	constructor(props) {
		super(props);
		this.state = {
			show: false,
			description: null,
			selectedType: "read"
		};
		this.types = {
			read: {
				description: "Read-only key",
				read: true,
				write: false
			},
			write: {
				description: "Write-only key",
				read: false,
				write: true
			},
			admin: {
				description: "Admin key",
				read: true,
				write: true
			}
		};
		this.newPermission = this.newPermission.bind(this);
		this.expand = this.expand.bind(this);
		this.onSelect = this.onSelect.bind(this);
		this.updateDescription = this.updateDescription.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		if(nextProps.description) {
			this.setState({
				description: this.props.description
			});
		}
	}
	newPermission() {
		const request = this.types[this.state.selectedType];
		if(this.state.description) {
			request.description = this.state.description;
		}
		this.props.newPermission(request);
		this.expand();
	}
	expand() {
		this.setState({
			show: !this.state.show,
			clearInput: true
		});
	}
	updateDescription(description) {
		if (description !== this.state.description) {
			this.setState({
				description,
				clearInput: false
			});
		}
	}
	onSelect(selectedType) {
		this.setState({
			selectedType
		});
	}
	renderElement(method) {
		let element = null;
		switch(method) {
			case 'description':
				element = (
					<div className="col-xs-12 ad-create-email">
						<Description updateDescription={this.updateDescription} clearInput={this.state.clearInput} />
					</div>
				);
			break;
			case 'buttonGroup':
					element = (
						<span className="ad-create-button-group without-margin col-xs-9">
							{
								Object.keys(this.types).map((type, index) => {
									return (
										<PermissionButton
											key={index}
											type={type}
											selectedType={this.state.selectedType}
											description={this.types[type].description}
											onSelect={this.onSelect}
										/>
									);
								})
							}
						</span>
					);
				break;
		}
		return element;
	}
	render() {
		const cx = classNames({
			'active': this.state.show
		});
		return (
			<div className={`ad-create col-xs-12 ${cx}`}>
				<div className="ad-create-collapse">
					<a className="ad-theme-btn primary" onClick={this.expand}>
						<i className="fa fa-plus"></i>&nbsp;&nbsp;New Credentials
					</a>
				</div>
				<div className="ad-create-expand row">
					{this.renderElement('description')}
					<div className="ad-create-button-group-container">
						{this.renderElement('buttonGroup')}
						<span className="col-xs-3">
							<button className="ad-theme-btn primary ad-create-submit" onClick={this.newPermission}>
								<i className="fa fa-plus"></i>&nbsp;&nbsp;Create
							</button>
						</span>
					</div>
				</div>
			</div>
		);
	}
}

class Description extends Component {
	constructor(props) {
		super(props);
		this.state = {
			description: ""
		};
		this.handleInput = this.handleInput.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		if(nextProps.clearInput) {
			this.setState({
				description: ""
			});
		}
	}
	handleInput(event) {
		this.setState({
			description: event.target.value
		}, this.validateDescription);
	}
	validateDescription() {
		if (this.state.description && this.state.description.trim()) {
			this.props.updateDescription(this.state.description);
		} else {
			this.props.updateDescription(null);
		}
	}
	render() {
		return (
			<input type="text" placeholder="Frontend key" className="form-control" value={this.state.description} onChange={this.handleInput} />
		);
	}
};

const PermissionButton = (props) => {
	const cx = classNames({
		"active": props.selectedType === props.type
	});
	return (
		<button className={`ad-create-button-group-btn ad-theme-btn col-xs-4 ${cx}`} onClick={props.onSelect && (() => props.onSelect(props.type))}>
			{props.description}
		</button>
	);
};
