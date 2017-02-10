import {
	default as React,
	Component
} from 'react';
import { render } from 'react-dom';

export class CredentialsView extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="col-xs-12 app-card-container">
				<div className="app-card permissionView col-xs-12">
					<div className="col-xs-12 permission-row">
						<span className="key">Username:&nbsp;</span><span className="value permission-username">{this.props.info && this.props.info.permission ? this.props.info.permission.body[0].username : ''}</span>
					</div>
					<div className="col-xs-12 permission-row">
						<span className="key">Password:&nbsp;</span><span className="value permission-password">{this.props.info && this.props.info.permission ? this.props.info.permission.body[0].password : ''}</span>
					</div>
				</div>
			</div>
		);
	}

}
