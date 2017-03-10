import React, { Component } from 'react';
import CopyToClipboard from '../../../shared/CopyToClipboard';
import ReactTooltip from 'react-tooltip';

export default class Credentials extends Component {
	constructor(props) {
		super(props);
		this.cset = false;
		this.state = {
			credentials: null
		};
	}

	componentDidUpdate() {
		if (this.props.app && this.props.app.permissions && this.props.app.permissions[this.props.type] && !this.cset) {
			this.cset = true;
			this.getPermission();
		}
	}

	componentWillUnmount() {
		this.stopUpdate = true;
	}

	getPermission() {
		const singleCredential = this.props.app.permissions[this.props.type];
		let justCredential = singleCredential.username + ':' + singleCredential.password;
		this.setState({
			singleCredential: singleCredential,
			credentials: justCredential
		});
	}

	ccSuccess() {
		toastr.success(`${this.props.label} Credentials has been copied successully!`);
		if(this.state.singleCredential.write) {
			toastr.warning('The copied credentials can modify data in your app, do not use them in code that runs in the web browser. Instead, generate <a href="guide-link">read-only credentials</a>.');
		}
	}
	ccError() {
		toastr.error('Error', e);
	}
	render() {
		return (
			<div>
				<CopyToClipboard onSuccess={() => this.ccSuccess()} onError={() => this.ccError()}>
					<a data-tip={`Copy ${this.props.label} Credentials`} data-effect="solid" data-place="left" data-offset="{'top': -10, 'left': 0}" className="card-icon pointer" data-clipboard-text={this.state.credentials}>
						<i className={`fa ${this.props.icon}`}></i>
						<ReactTooltip />
					</a>
				</CopyToClipboard>
			</div>
		)
	}
}
