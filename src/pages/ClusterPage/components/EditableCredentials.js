import React, { Component } from 'react';
import { Icon, message, Input } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { credsBox } from '../styles';

export default class EditableCredentials extends Component {
	constructor(props) {
		super(props);

		this.state = {
			value: props.text,
		};
	}

	toggleHidden = () => {
		this.setState(state => ({
			hidden: !state.hidden,
		}));
	};

	handleChange = e => {
		const { onChange } = this.props;
		this.setState(
			{
				value: e.target.value,
			},
			() => {
				if (onChange) {
					onChange(this.state.value);
				}
			},
		);
	};

	copySuccess = source => {
		// eslint-disable-next-line
		message.success(`${source} has been copied successully!`);
	};

	render() {
		const { value } = this.state;
		const { text, name, visible, updateVisibility, disabled } = this.props;

		return (
			<div className={credsBox}>
				{visible ? (
					<Input
						className="input"
						value={value}
						onChange={this.handleChange}
						disabled={disabled}
					/>
				) : (
					<span className="cred-text">
						############################&nbsp;
					</span>
				)}

				<span className="cred-button">
					<CopyToClipboard
						text={text}
						onCopy={() => this.copySuccess(name)}
					>
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
