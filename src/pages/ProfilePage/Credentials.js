import React, { Component } from 'react';
import {
 Card, Tooltip, Button, notification, Popconfirm, Spin,
} from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { css } from 'react-emotion';

import Flex from '../../batteries/components/shared/Flex';
import { ACC_API } from '../../constants/config';

const EyeIcon = require('react-feather/dist/icons/eye').default;
const EyeOffIcon = require('react-feather/dist/icons/eye-off').default;
const CopyIcon = require('react-feather/dist/icons/copy').default;
const ResetIcon = require('react-feather/dist/icons/refresh-ccw').default;

const container = css`
	border: 1px solid #e8e8e8;
	padding: 2px 10px;
	.ant-btn {
		border: transparent;
		background-color: transparent;
		margin-left: 5px;
		padding: 0 5px;
	}
`;

class Credentials extends Component {
	state = {
		viewKey: false,
		key: '',
		isLoading: true,
		isReseting: false,
	};

	componentDidMount() {
		this.getKey();
	}

	toggleLoading = () => {
		this.setState(prevState => ({
			isLoading: !prevState.isLoading,
		}));
	};

	toggleReseting = () => {
		this.setState(prevState => ({
			isReseting: !prevState.isReseting,
		}));
	};

	getKey = async () => {
		try {
			const response = await fetch(`${ACC_API}/user/credentials`, {
				method: 'GET',
				credentials: 'include',
				headers: {
					'content-type': 'application/json',
				},
			});
			const data = await response.json();
			this.toggleLoading();

			this.setState({
				key: data.credentials,
			});
		} catch (err) {
			this.toggleLoading();
			throw new Error(err);
		}
	};

	handleViewClick = () => {
		this.setState(prevState => ({
			viewKey: !prevState.viewKey,
		}));
	};

	handleCopyCred = () => {
		notification.success({
			message: 'Credentials have been copied successfully!',
		});
	};

	handleKeyReset = async () => {
		this.toggleReseting();
		try {
			const response = await fetch(`${ACC_API}/user/credentials/rotate`, {
				method: 'POST',
				credentials: 'include',
				headers: {
					'content-type': 'application/json',
				},
			});
			const data = await response.json();
			this.toggleReseting();

			if (response.status >= 400) {
				throw new Error(data);
			}

			notification.success({
				message: data.message,
			});

			this.getKey();
		} catch (err) {
			this.toggleReseting();
			throw new Error(err);
		}
	};

	render() {
		const {
 viewKey, key, isLoading, isReseting,
} = this.state;
		return (
			<Card title="Master Credentials" css={{ minHeight: 200 }}>
				{isLoading ? (
					<Flex alignItems="center" justifyContent="center">
						<Spin />
					</Flex>
				) : (
					<Flex alignItems="center">
						<Flex justifyContent="space-between" alignItems="center" css={container}>
							<span>
								{viewKey ? key : '########################################'}
							</span>
							<Flex>
								<Tooltip
									placement="topLeft"
									title={viewKey ? 'Hide credentials' : 'View credentials'}
								>
									<Button onClick={this.handleViewClick} type="normal">
										{viewKey ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
									</Button>
								</Tooltip>
								<CopyToClipboard text={key} onCopy={this.handleCopyCred}>
									<Tooltip placement="topLeft" title="Copy To Clipboard">
										<Button type="normal">
											<CopyIcon size={16} />
										</Button>
									</Tooltip>
								</CopyToClipboard>
								<Popconfirm
									title="Are you sure reset this key?"
									onConfirm={this.handleKeyReset}
									okText="Yes"
									cancelText="No"
								>
									<Button disabled={isReseting}>
										<ResetIcon size={16} />
									</Button>
								</Popconfirm>
							</Flex>
						</Flex>
					</Flex>
				)}
			</Card>
		);
	}
}

export default Credentials;
