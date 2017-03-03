import React, { Component } from 'react';

export default class NewPermission extends Component {
	constructor(props) {
		super(props);
		this.state = {
			show: false
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
		this.newPermission = this.newPermission.bind(this);
		this.exapand = this.exapand.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		if(nextProps.description) {
			this.setState({
				description: this.props.description
			});
		}
	}
	newPermission(type) {
		this.props.newPermission(this.types[type]);
		this.exapand();
	}
	exapand() {
		this.setState({
			show: !this.state.show
		});
	}
	renderElement(method) {
		let element = null;
		switch(method) {
			case 'buttonGroup':
				let group = (
					<div className="description-show col-xs-12">
						{
							Object.keys(this.types).map((type, index) => {
								return (
									<PermissionButton 
										key={index}
										type={type} 
										description={this.types[type].description} 
										onAction={this.newPermission}
									/>
								);
							})
						}
					</div>
				);
				if(this.state.show) {
					element = group;
				}
			break;
		}
		return element;
	}
	render() {
		return (
			<div className="permission-description col-xs-12">
				<a className="btn btn-primary" onClick={this.exapand}>
					New Credentials
				</a>
				{this.renderElement('buttonGroup')}
			</div>
		);
	}
}

const PermissionButton = (props) => {
	return (
		<button className={`btn btn-success`} onClick={props.onAction && (() => props.onAction(props.type))}>
			{props.description}
		</button>
	);
};