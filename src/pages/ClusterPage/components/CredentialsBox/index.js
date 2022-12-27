import React, { Component } from 'react';

import {
	CloseCircleOutlined,
	CopyOutlined,
	EyeOutlined,
	SyncOutlined,
	WarningOutlined,
} from '@ant-design/icons';

import { message, Popover, Button } from 'antd';
import { string, func, bool } from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { credsBox, confirmationBox } from '../../styles';

export default class CredentialsBox extends Component {
	constructor(props) {
		super(props);

		this.state = {
			hidden: props.hidden || true,
			confirmationBoxVisible: false,
			displayText: undefined,
			showRotateAPICredentials: props.showRotateAPICredentials || false,
		};
	}

	hideConfirmationBox = () => {
		this.setState({
			confirmationBoxVisible: false,
		});
	};

	handleVisibleChange = visible => {
		this.setState({ confirmationBoxVisible: visible });
	};

	toggleHidden = () => {
		this.setState(state => ({
			hidden: !state.hidden,
		}));
	};

	copySuccess = source => {
		// eslint-disable-next-line
		message.success(`${source} credentials have been copied successully!`);
	};

	updateAPICredentials = async (type, clusterId, rotateAPICredentials) => {
		this.hideConfirmationBox();
		const res = await rotateAPICredentials(type, clusterId);
		const { status, username, password } = res;
		this.setState({
			displayText: `${username}:${password}`,
		});
		if (status.code < 300) {
			// eslint-disable-next-line
			message.success(`${type} ${status.message}!`);
		} else {
			// eslint-disable-next-line
			message.error(`${type} ${status.message}!`);
		}
	};

	renderConfirmationBox = (type, rotateAPICredentials, clusterId) => {
		const { showRotateAPICredentials } = this.state;
		return (
			<Popover
				content={
					<div className={confirmationBox}>
						<div className="confirmation-header">
							<span className="icon-wrapper">
								<WarningOutlined className="icon" />
							</span>
							Warning
						</div>
						<div className="confirmation-text">
							{showRotateAPICredentials &&
								`Rotating API credentials will invalidate the current
							API credential. Do you still want to proceed?`}
							{!showRotateAPICredentials &&
								`Your role is of type viewer. Only an admin role can rotate the API credentials.`}
						</div>
						<div className="buttons-wrapper">
							<div>
								<Button
									danger
									ghost
									size="small"
									className="cancel-button"
									onClick={this.hideConfirmationBox}
								>
									<span className="button-text">Cancel</span>
								</Button>
							</div>
							{showRotateAPICredentials && (
								<div>
									<Button
										type="primary"
										size="small"
										onClick={() =>
											this.updateAPICredentials(
												type,
												clusterId,
												rotateAPICredentials,
											)
										}
										className="confirm-button"
									>
										<span className="button-text">
											Confirm
										</span>
									</Button>
								</div>
							)}
						</div>
					</div>
				}
				trigger="click"
				visible={this.state.confirmationBoxVisible}
				onVisibleChange={this.handleVisibleChange}
			>
				<SyncOutlined style={{ color: '#ff0000' }} />
			</Popover>
		);
	};

	render() {
		const { hidden, displayText } = this.state;
		const {
			text,
			name,
			isEditable,
			inputRef,
			rotateAPICredentials,
			clusterId,
		} = this.props;

		return (
			<div className={credsBox}>
				{isEditable ? (
					<span
						className="cred-text"
						ref={inputRef}
						contentEditable
						dangerouslySetInnerHTML={{
							__html: displayText || text,
						}}
					/>
				) : (
					<span
						className="cred-text"
						contentEditable={!!(isEditable && !hidden)}
					>
						{hidden
							? '#######################################'
							: displayText || text}
					</span>
				)}

				<span className="cred-button">
					<span>
						{isEditable ? null : (
							<a onClick={this.toggleHidden}>
								{hidden ? (
									<EyeOutlined />
								) : (
									<CloseCircleOutlined />
								)}
								<span className="cred-button-text">
									{hidden ? 'Show' : 'Hide'}
								</span>
							</a>
						)}
						<CopyToClipboard
							text={text}
							onCopy={() => this.copySuccess(name)}
						>
							<a data-clipboard-text={text}>
								<CopyOutlined />
								<span className="cred-button-text">Copy</span>
							</a>
						</CopyToClipboard>
					</span>
					<span>
						{this.renderConfirmationBox(
							name,
							rotateAPICredentials,
							clusterId,
						)}
					</span>
				</span>
			</div>
		);
	}
}

CredentialsBox.propTypes = {
	text: string.isRequired,
	name: string.isRequired,
	rotateAPICredentials: func.isRequired,
	showRotateAPICredentials: bool,
};
