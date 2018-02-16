import React,{ Component } from 'react';
import Tooltip from 'rc-tooltip';
import { appbaseService } from '../../../service/AppbaseService';
import DeleteApp from './DeleteApp';
import Credentials from './Credentials';
import CloneApp from './CloneApp';

export default class ActionButtons extends Component {

	constructor(props) {
		super(props);
		this.stopBubble = this.stopBubble.bind(this);
	}

	stopBubble(event) {
		event.stopPropagation();
	}

	isDifferentOwner() {
		return this.props.app && appbaseService && appbaseService.userInfo && appbaseService.userInfo.body && this.props.app.owner !== appbaseService.userInfo.body.email ? true : false;
	}

	render() {
		return (
			<aside className="options" onClick={this.stopBubble}>
				<Tooltip
					overlay={<div>Clone this app</div>}
					mouseLeaveDelay={0}
				>
					<div className="options-item">
						<CloneApp app={this.props.app} />
					</div>
				</Tooltip>
				<Tooltip
					overlay={<div>Copy read Credentials</div>}
					mouseLeaveDelay={0}
				>
					<div className="options-item">
						<Credentials {...this.props} type="readPermission" label="Read" icon="fa-eye" />
					</div>
				</Tooltip>
				<Tooltip
					overlay={<div>Copy write Credentials</div>}
					mouseLeaveDelay={0}
				>
					<div className="options-item">
						<Credentials {...this.props} type="writePermission" label="Write" icon="fa-key" />
					</div>
				</Tooltip>
				{
					!this.isDifferentOwner() ? (
						<Tooltip
							overlay={<div>Delete app</div>}
							mouseLeaveDelay={0}
						>
							<div className="options-item">
								<DeleteApp {...this.props} />
							</div>
						</Tooltip>
					) : null
				}
			</aside>
		);
	}

}
