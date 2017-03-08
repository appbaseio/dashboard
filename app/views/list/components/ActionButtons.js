import React,{ Component } from 'react';
import { appbaseService } from '../../../service/AppbaseService';
import DeleteApp from './DeleteApp';
import Credentials from './Credentials';

export default class ActionButtons extends Component {

	constructor(props) {
		super(props);
		this.stopBubble = this.stopBubble.bind(this);
	}

	stopBubble(event) {
		event.stopPropagation();
	}

	isDifferentOwner() {
		return this.props.app && this.props.app.appInfo && appbaseService && appbaseService.userInfo && appbaseService.userInfo.body && this.props.app.appInfo.owner !== appbaseService.userInfo.body.email ? true : false;
	}

	render() {
		return (
			<aside className="options" onClick={this.stopBubble}>
				<div className="options-item">
					<Credentials data-tip="Copy read Credentials" {...this.props} type="readPermission" label="Read" icon="fa-clone" />
				</div>
				<div className="options-item">
					<Credentials data-tip="Copy write Credentials" {...this.props} type="writePermission" label="Write" icon="fa-pencil" />
				</div>
				{
					!this.isDifferentOwner() ? (
						<div className="options-item bottom">
							<DeleteApp {...this.props} />
						</div>
					) : null
				}
			</aside>
		);
	}

}