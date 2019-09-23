import React, { Component } from 'react';
import { Icon, message } from 'antd';
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
		message.success(`${source} credentials have been copied successully!`);
	};

	render() {
		const { hidden } = this.state;
		const {
 text, name, isEditable, inputRef,
} = this.props;

		return (
			<div className={credsBox}>
				{isEditable ? (
					<span
						className="cred-text"
						ref={inputRef}
						contentEditable
						dangerouslySetInnerHTML={{ __html: text }}
					/>
				) : (
					<span className="cred-text" contentEditable={!!(isEditable && !hidden)}>
						{hidden ? '#######################################' : text}
					</span>
				)}

				<span className="cred-button">
					{isEditable ? null : (
						<a onClick={this.toggleHidden}>
							{hidden ? (
								<Icon type="eye" theme="outlined" />
							) : (
								<Icon type="close-circle" theme="outlined" />
							)}
							<span className="cred-button-text">{hidden ? 'Show' : 'Hide'}</span>
						</a>
					)}
					<CopyToClipboard text={text} onCopy={() => this.copySuccess(name)}>
						<a data-clipboard-text={text}>
							<Icon type="copy" theme="outlined" />
							<span className="cred-button-text">Copy</span>
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
