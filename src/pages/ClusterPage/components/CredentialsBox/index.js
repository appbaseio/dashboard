import React, { Component } from 'react';
import { Icon } from 'antd';
import { string } from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { credsBox } from '../../styles';

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
	};

	copySuccess = (source) => {
		// eslint-disable-next-line
		toastr.success(`${source} credentials have been copied successully!`);
	};

	copyError = () => {
		// eslint-disable-next-line
		toastr.error('Error', e);
	};

	render() {
		const { hidden } = this.state;
		const { text, name } = this.props;

		return (
			<div className={credsBox}>
				<span style={{ width: 402 }}>
					{hidden ? '#######################################' : text}
				</span>
				<span>
					<a onClick={this.toggleHidden}>
						{hidden ? (
							<Icon type="eye" theme="outlined" />
						) : (
							<Icon type="close-circle" theme="outlined" />
						)}
					</a>
					<CopyToClipboard
						type="danger"
						onSuccess={() => this.copySuccess(name)}
						onError={() => this.copyError(name)}
					>
						<a data-clipboard-text={text}>
							<Icon type="copy" theme="outlined" />
						</a>
					</CopyToClipboard>
				</span>
			</div>
		);
	}
}

CredentialsBox.propTypes = {
	text: string.isRequired,
	name: string.isRequired,
};
