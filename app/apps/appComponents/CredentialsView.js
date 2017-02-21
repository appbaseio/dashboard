import {
	default as React,
	Component
} from 'react';
import { render } from 'react-dom';
import { appbaseService } from '../../service/AppbaseService';

export class CredentialsView extends Component {

	constructor(props) {
		super(props);
	}

	renderElement(method) {
		let element = null;
		switch(method) {
			case 'permissions':
				if(this.props.info && this.props.info.permission) {
					element = this.props.info.permission.body.map((permissionInfo, index) => {
						return (<PermissionCard key={index} permissionInfo={permissionInfo} />);
					})
				}
			break;
		}
		return element;
	}

	render() {
		if(this.props.info && this.props.info.permission) {
			console.log(this.props.info.permission);
		}
		return (
			<div className="col-xs-12 app-card-container">
				{this.renderElement('permissions')}
			</div>
		);
	}

}

class PermissionCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			read: this.props.permissionInfo.read,
			write: this.props.permissionInfo.write,
			description: this.props.permissionInfo.description
		};
	}
	changePermission(method) {
		this.setState({
			[method]: !this.state[method]
		}, this.applyChange);
	}
	applyChange() {
		appbaseService.updatePermission(this.props.permissionInfo.username, this.state).then((data) => {
			console.log(data);
		}).catch((e) => {
			console.log(e);
		});
	}
	render() {
		return (
			<div className="app-card permissionView col-xs-12">
				<div className="col-xs-12 permission-row">
					<span className="key">Username:&nbsp;</span>
					<span className="value permission-username">{this.props.permissionInfo.username}</span>
				</div>
				<div className="col-xs-12 permission-row">
					<span className="key">Password:&nbsp;</span>
					<span className="value permission-password">{this.props.permissionInfo.password}</span>
				</div>
				<div className="col-xs-12 permission-row">
					<span className="checkbox">
						<label>
							<input type="checkbox" checked={this.state.read} onChange={() => this.changePermission('read')} /> R
						</label>
					</span>
					<span className="checkbox">
						<label>
							<input type="checkbox" checked={this.state.write} onChange={() => this.changePermission('write')} /> W
						</label>
					</span>
				</div>
			</div>
		);
	}
}