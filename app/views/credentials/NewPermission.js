import React, { Component } from 'react';
import classNames from "classnames";

export default class NewPermission extends Component {
	constructor(props) {
		super(props);
		this.state = {
			show: false,
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
	}
	componentWillReceiveProps(nextProps) {
		if(nextProps.description) {
			this.setState({
				description: this.props.description
			});
		}
	}
	newPermission() {
		this.props.newPermission(this.types[this.state.selectedType]);
		this.expand();
	}
	expand() {
		this.setState({
			show: !this.state.show
		});
	}
	onSelect(selectedType) {
		this.setState({
			selectedType
		});
	}
	renderElement(method) {
		let element = null;
		switch(method) {
			case 'buttonGroup':
					element = (
						<span className="ad-create-button-group">
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
						New Credentials
					</a>
				</div>
				<div className="ad-create-expand">
					{this.renderElement('buttonGroup')}
					<a className="ad-theme-btn primary" onClick={this.newPermission}>
						Create Credentials
					</a>
				</div>
			</div>
		);
	}
}

const PermissionButton = (props) => {
	const cx = classNames({
		"active": props.selectedType === props.type
	});
	return (
		<button className={`ad-create-button-group-btn ad-theme-btn ${cx}`} onClick={props.onSelect && (() => props.onSelect(props.type))}>
			{props.description}
		</button>
	);
};
