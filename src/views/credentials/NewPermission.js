import React, { Component } from 'react';
import classNames from 'classnames';

export default class NewPermission extends Component {
	constructor(props) {
		super(props);
		this.state = {
			show: false,
			description: null,
			selectedType: 'read',
		};
		this.types = {
			read: {
				description: 'Read-only key',
				read: true,
				write: false,
			},
			write: {
				description: 'Write-only key',
				read: false,
				write: true,
			},
			admin: {
				description: 'Admin key',
				read: true,
				write: true,
			},
		};
		this.newPermission = this.newPermission.bind(this);
		this.expand = this.expand.bind(this);
		this.onSelect = this.onSelect.bind(this);
		this.updateDescription = this.updateDescription.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.description) {
			this.setState({
				description: this.props.description,
			});
		}
	}
	newPermission() {
		const request = this.types[this.state.selectedType];
		if (this.state.description) {
			request.description = this.state.description;
		}
		this.props.newPermission(request);
		this.expand();
	}
	expand() {
		this.setState({
			show: !this.state.show,
			clearInput: true,
		});
	}
	updateDescription(description) {
		if (description !== this.state.description) {
			this.setState({
				description,
				clearInput: false,
			});
		}
	}
	onSelect(selectedType) {
		this.setState({
			selectedType,
		});
	}
	renderElement(method) {
		let element = null;
		switch (method) {
			case 'description':
				element = (
					<div className="ad-create-email">
						<Description
							updateDescription={this.updateDescription}
							clearInput={this.state.clearInput}
						/>
					</div>
				);
				break;
			case 'buttonGroup':
				element = (
					<span className="ad-create-button-group without-margin">
						{Object.keys(this.types).map((type, index) => {
							return (
								<PermissionButton
									key={index}
									type={type}
									selectedType={this.state.selectedType}
									description={this.types[type].description}
									onSelect={this.onSelect}
								/>
							);
						})}
					</span>
				);
				break;
		}
		return element;
	}
	render() {
		const cx = classNames({
			active: this.state.show,
		});
		return (
			<div className={`ad-create col-xs-12 ${cx}`}>
				<div className="ad-create-collapse">
					<a className="ad-theme-btn primary" onClick={this.expand}>
						New Credentials
					</a>
				</div>
				<div className="ad-create-expand flex align-center justify-between">
					<div>
						{this.renderElement('description')}
						<div className="ad-create-button-group-container">
							{this.renderElement('buttonGroup')}
						</div>
					</div>
					<div>
						<button
							className="ad-theme-btn primary ad-create-submit"
							onClick={this.newPermission}
						>
							Create
						</button>
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
			description: '',
		};
		this.handleInput = this.handleInput.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.clearInput) {
			this.setState({
				description: '',
			});
		}
	}
	handleInput(event) {
		this.setState(
			{
				description: event.target.value,
			},
			this.validateDescription,
		);
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
			<input
				type="text"
				placeholder="Optional description text"
				className="form-control"
				value={this.state.description}
				onChange={this.handleInput}
			/>
		);
	}
}

const PermissionButton = props => {
	const cx = classNames({
		active: props.selectedType === props.type,
	});
	return (
		<label className="radio-inline">
			<input
				type="radio"
				name={props.type}
				checked={props.selectedType === props.type}
				onChange={props.onSelect && (() => props.onSelect(props.type))}
			/>{' '}
			{props.description}
			<span className="checkmark" />
		</label>
	);
};
