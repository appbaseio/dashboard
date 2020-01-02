import React, { Component } from 'react';
import { Card, Button, notification, Popconfirm, Spin, Row, Alert } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { ACC_API } from '../../constants/config';
import credsBox from './styles';

class Credentials extends Component {
	state = {
		isHidden: true,
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
			this.toggleLoading();
			const response = await fetch(`${ACC_API}/user/credentials`, {
				credentials: 'include',
			});
			const data = await response.json();

			this.setState({
				key: data.credentials,
				isLoading: false,
			});
		} catch (err) {
			this.toggleLoading();
			throw new Error(err);
		}
	};

	handleViewClick = () => {
		this.setState(prevState => ({
			isHidden: !prevState.isHidden,
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
				notification.error({
					message: data.message,
				});
			}

			notification.success({
				message: data.message,
			});

			this.getKey();
		} catch (err) {
			this.toggleReseting();
			notification.error({
				message:
					'Something went Wrong.Please report if the bug persists.',
			});
		}
	};

	render() {
		const { isHidden, key, isLoading, isReseting } = this.state;
		return (
			<Card title="Master Credentials" css={{ minHeight: 200 }}>
				{isLoading ? (
					<Row align="middle" justify="center">
						<Spin />
					</Row>
				) : (
					<div className={credsBox}>
						<span className="cred-text">
							{isHidden
								? '#######################################'
								: key}
						</span>
						<span className="cred-button">
							<Button
								css={{ border: 0 }}
								onClick={this.handleViewClick}
								icon={isHidden ? 'eye' : 'close-circle'}
								data-clipboard-text={key}
								theme="outlined"
							/>
							<CopyToClipboard
								text={key}
								onCopy={this.handleCopyCred}
							>
								<Button
									css={{ border: 0 }}
									icon="copy"
									data-clipboard-text={key}
								/>
							</CopyToClipboard>
							<Popconfirm
								title="Are you sure you want to reset this key?"
								onConfirm={this.handleKeyReset}
								okText="Yes"
								cancelText="No"
							>
								<Button
									disabled={isReseting}
									css={{ border: 0 }}
									icon="reload"
								/>
							</Popconfirm>
						</span>
					</div>
				)}
				<Alert
					showIcon
					description="Master credentials allow you to perform the same dashboard actions via an API, i.e. you can programmatically create apps, delete apps, get analytics, and more using it. Use them with extreme caution!"
					type="warning"
					css={{
						margin: '20px 0px',
					}}
				/>
			</Card>
		);
	}
}

export default Credentials;
