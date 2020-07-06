import React from 'react';
import { Row, Col, Icon, notification } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { withRouter } from 'react-router-dom';

import { columnSeparator, actionIcon, deleteButton } from './styles';
import DeleteAppModal from './DeleteAppModal';
import { SCALR_URL } from '../../constants/config';
import {
	getCredentialsFromPermissions,
	getReadCredentialsFromPermissions,
} from '../../batteries/utils';

class ActionButtons extends React.Component {
	state = {
		deleteModal: false,
	};

	handleDeleteModal = () => {
		const { deleteModal: currentValue } = this.state;
		this.setState({
			deleteModal: !currentValue,
		});
	};

	handleClone = () => {
		const { appName, permissions, history } = this.props;
		if (permissions) {
			const { username, password } = get(permissions, 'results[0]');
			const parameters = {
				type: 'elasticsearch',
				indexName: appName,
				clusterURL: `https://${username}:${password}@${SCALR_URL}`,
			};
			history.push(
				`/app/${appName}/import/?source=${JSON.stringify(parameters)}`,
			);
		}
	};

	copyWriteKey = () => {
		notification.warning({
			message: 'Write Credentials copied',
			description:
				'The copied credentials can modify data in your app, do not use them in code that runs in the web browser. Instead, generate read-only credentials.',
		});
	};

	copyAdminKey = () => {
		notification.warning({
			message: 'Admin Credentials copied',
			description:
				'The copied credentials can modify data in your app, do not use them in code that runs in the web browser. Instead, generate read-only credentials.',
		});
	};

	getWriteKey = () => {
		const { permissions } = this.props;
		if (permissions) {
			const data = getCredentialsFromPermissions(
				get(permissions, 'results'),
			);
			if (data) {
				const { username, password } = data;
				return `${username}:${password}`;
			}
			return '';
		}
		return '';
	};

	getReadKey = () => {
		const { permissions } = this.props;
		if (permissions) {
			const data = getReadCredentialsFromPermissions(
				get(permissions, 'results'),
			);
			if (data) {
				const { username, password } = data;
				return `${username}:${password}`;
			}
			return '';
		}
		return '';
	};

	copyReadKey = () => {
		notification.success({
			message: 'Read Credentials copied',
			description: '',
		});
	};

	copySharedKey = () => {
		const { permissions } = this.props;
		let write = false;
		let read = false;
		if (permissions) {
			write = get(permissions, 'results[0].write'); // eslint-disable-line
			read = get(permissions, 'results[0].read'); // eslint-disable-line
		}

		if (write && !read) {
			this.copyWriteKey();
		} else if (!write && read) {
			this.copyReadKey();
		} else if (write && read) {
			this.copyAdminKey();
		} else {
			notification.error({
				message: 'No Credentials copied',
				description: '',
			});
		}
	};

	render() {
		const {
			appName,
			appId,
			shared,
			permissions // prettier-ignore
		} = this.props;
		const { deleteModal } = this.state;

		const readKey = this.getReadKey();
		const writeKey = this.getWriteKey();
		let sharedKey = '';
		if (shared && permissions && permissions.results) {
			// We only get one key for shared app either it will be read key or a write key
			sharedKey = `${get(permissions, 'results[0].username')}:${get(
				permissions,
				'results[0].password',
			)}`;
		}

		return (
			// eslint-disable-next-line
			<div
				className="card-actions"
				key={appName}
				onClick={e => {
					e.preventDefault();
					e.stopPropagation();
				}}
			>
				<Row type="flex" justify="space-between">
					<Col
						span={shared ? 12 : 6}
						className={columnSeparator}
						onClick={this.handleClone}
					>
						<Icon className={actionIcon} type="fork" />
						Clone
					</Col>

					{writeKey && !shared ? (
						<CopyToClipboard
							text={writeKey}
							onCopy={this.copyWriteKey}
						>
							<Col span={6} className={columnSeparator}>
								<Icon className={actionIcon} type="copy" />
								Write Key
							</Col>
						</CopyToClipboard>
					) : null}

					{readKey && !shared ? (
						<CopyToClipboard
							text={readKey}
							onCopy={this.copyReadKey}
						>
							<Col
								span={shared ? 12 : 6}
								className={columnSeparator}
							>
								<Icon className={actionIcon} type="copy" />
								Read Key
							</Col>
						</CopyToClipboard>
					) : null}

					{shared ? (
						<CopyToClipboard
							text={sharedKey}
							onCopy={this.copySharedKey}
						>
							<Col
								span={shared ? 12 : 6}
								className={columnSeparator}
							>
								<Icon className={actionIcon} type="copy" />
								Shared Key
							</Col>
						</CopyToClipboard>
					) : (
						<Col
							span={6}
							onClick={this.handleDeleteModal}
							className={deleteButton}
						>
							<Icon className={actionIcon} type="delete" />
							Delete App
						</Col>
					)}
				</Row>
				<DeleteAppModal
					appName={appName}
					deleteModal={deleteModal}
					handleDeleteModal={this.handleDeleteModal}
				/>
			</div>
		);
	}
}

ActionButtons.propTypes = {
	appName: PropTypes.string.isRequired,
	appId: PropTypes.string.isRequired,
	shared: PropTypes.bool, // eslint-disable-line
	permissions: PropTypes.object, // eslint-disable-line
};

export default withRouter(ActionButtons);
