import {
	default as React,
	Component
} from 'react';
import { render } from 'react-dom';
import { appbaseService } from '../../service/AppbaseService';
import {CredentialsToClipboard} from './CredentialsToClipboard';
import {ConfigButton} from './ConfigButton';
export class ActionButtons extends Component {

	constructor(props) {
		super(props);
		this.stopBubble = this.stopBubble.bind(this);
	}

	stopBubble(event) {
		event.stopPropagation();
	}

	render() {
		return (
			<span className="ad-actionbuttons" onClick={this.stopBubble}>
				<CredentialsToClipboard {...this.props} />
				<ConfigButton {...this.props} />
			</span>
		);
	}

}