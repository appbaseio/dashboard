import React, { Component } from 'react';
import CopyToClipboard from '../../../../shared/CopyToClipboard';

export default class CredentialsBox extends Component {
	constructor(props) {
		super(props);

		this.state = {
			hidden: true,
		};
	}

	toggleHidden = () => {
		this.setState(state => ({
			hidden: !state.hidden,
		}));
	}

	copySuccess = (source) => {
		// eslint-disable-next-line
		toastr.success(`${source} credentials have been copied successully!`);
	}

	copyError = () => {
		// eslint-disable-next-line
		toastr.error('Error', e);
	}

	render() {
		return (
			<div className="creds-box">
				<span style={{ width: 402 }}>
					{
						this.state.hidden
							? '#######################################'
							: this.props.text
					}
				</span>
				<span>
					<a onClick={this.toggleHidden}>
						<i className={`fas ${this.state.hidden ? 'fa-eye' : 'fa-eye-slash'}`} />
					</a>
					<CopyToClipboard
						type="danger"
						onSuccess={() => this.copySuccess(this.props.name)}
						onError={() => this.copyError(this.props.name)}
					>
						<a data-clipboard-text={this.props.text}>
							<i className="far fa-clone" />
						</a>
					</CopyToClipboard>
				</span>
			</div>
		);
	}
}
