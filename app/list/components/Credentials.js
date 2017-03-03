import React, { Component } from 'react';

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
		if(this.cp) {
			this.cp.destroy();
		}
	}

	getPermission() {
		const singleCredential = this.props.app.permissions[this.props.type];
		let justCredential = singleCredential.username + ':' + singleCredential.password;
		this.setState({
			singleCredential: singleCredential,
			credentials: justCredential
		}, this.setClipboard);
	}

	setClipboard() {
		setTimeout(() => {
			let credId = `#cred-${this.props.label}-${this.props.app.id}`;
			this.cp = new Clipboard(credId);
			this.cp.on('success', (e) => {
				toastr.success(`${this.props.label} Credentials has been copied successully!`);
				if(this.state.singleCredential.write) {
					toastr.warning('The copied credentials can modify data in your app, do not use them in code that runs in the web browser. Instead, generate <a href="guide-link">read-only credentials</a>.');
				}
			});
			this.cp.on('error', (e) => {
				toastr.error('Error', e);
			})
		}, 300);
	}

	render() {
		return (
			<div>
				<a id={`cred-${this.props.label}-${this.props.app.id}`} title={`Copy ${this.props.label} Credentials`} className="card-icon pointer"  data-clipboard-text={this.state.credentials}>
					<i className={`fa ${this.props.icon}`}></i>
				</a>
			</div>
		)
	}
}
