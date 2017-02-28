import {
	default as React,
	Component
} from 'react';
import { render } from 'react-dom';
import { appbaseService } from '../../service/AppbaseService';

export class CredentialsToClipboard extends Component {

	constructor(props) {
		super(props);
		this.cset = false;
		this.state = {
			credentials: null
		};
	}

	componentDidUpdate() {
		if (this.props.app.id && !this.cset) {
			this.cset = true;
			this.getPermission();
		}
	}

	componentWillUnmount() {
		if(this.cp) {
			this.cp.destroy();
		}
	}

	getPermission() {
		appbaseService.getPermission(this.props.app.id).then((data) => {
			if (data && data.body && data.body.length) {
				let singleCredential = data.body[this.pickPermission(data.body)];
				let justCredential = singleCredential.username + ':' + singleCredential.password;
				this.setState({
					credentials: justCredential,
					singleCredential: singleCredential
				}, this.setClipboard);
			}
		});
	}

	pickPermission(permissions) {
		let found = null;
		permissions.filter((perm, index) => {
			if(perm.description.indexOf('Default') > -1) {
				found = index;
			}
		});
		if(found === null) {
			found = 0;
		}
		return found;
	}

	setClipboard() {
		setTimeout(() => {
			let credId = "#cred-" + this.props.app.id;
			this.cp = new Clipboard(credId);
			this.cp.on('success', (e) => {
				toastr.success(this.state.singleCredential.description+' Credentials has been copied successully!');
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
			<button id={"cred-"+this.props.app.id} className="ad-ctoc btn" data-clipboard-text={this.state.credentials}>
				<i className="fa fa-files-o"></i>
			</button>
		);
	}
}
