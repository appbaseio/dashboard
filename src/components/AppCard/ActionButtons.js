import React from 'react';
import {
 Row, Col, Icon, notification,
} from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import PropTypes from 'prop-types';

import { columnSeparator, actionIcon, deleteButton } from './styles';
import DeleteAppModal from './DeleteAppModal';
import { SCALR_URL, IMPORTER_LINK } from '../../constants/config';
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
		const { appName, permissions } = this.props;
		const { username, password } = permissions.results[0];
		const parameters = {
			platform: 'appbase',
			importFrom: {
				appname: appName,
				hosturl: `https://${username}:${password}@${SCALR_URL}`,
			},
		};
		window.open(`${IMPORTER_LINK}${JSON.stringify(parameters)}`, '_blank');
	};

	copyWriteKey = () => {
		notification.warning({
			message: 'Write Credentials copied',
			description:
				'The copied credentials can modify data in your app, do not use them in code that runs in the web browser. Instead, generate read-only credentials.',
		});
	};

	getWriteKey = () => {
		const { permissions } = this.props;
		if (permissions) {
			const { username, password } = getCredentialsFromPermissions(permissions.results);
			return `${username}:${password}`;
		}
		return '';
	};

	getReadKey = () => {
		const { permissions } = this.props;
		if (permissions) {
			const data = getReadCredentialsFromPermissions(permissions.results);
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
    let write = true;
		if (permissions) {
			write = permissions.results[0].read && permissions.results[0].write;
		}

    if (write) this.copyWriteKey();
    else this.copyReadKey();
	};

	render() {
		const {
     appName, appId, shared, permissions,
    } = this.props;
		const { deleteModal } = this.state;

		const readKey = this.getReadKey();
		const writeKey = this.getWriteKey();
    let sharedKey = '';
    if (shared && permissions) {
      // We only get one key for shared app either it will be read key or a write key
      sharedKey = `${permissions.results[0].username}:${permissions.results[0].password}`;
    }

		return (
			// eslint-disable-next-line
			<div
				className="card-actions"
				key={appName}
				onClick={(e) => {
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

					{!shared ? (
						<CopyToClipboard text={writeKey} onCopy={this.copyWriteKey}>
							<Col span={6} className={columnSeparator}>
								<Icon className={actionIcon} type="copy" />
								Write Key
							</Col>
						</CopyToClipboard>
					) : null}

					{readKey && !shared ? (
						<CopyToClipboard text={readKey} onCopy={this.copyReadKey}>
							<Col span={shared ? 12 : 6} className={columnSeparator}>
								<Icon className={actionIcon} type="copy" />
								Read Key
							</Col>
						</CopyToClipboard>
					) : null}

          {shared ? (
						<CopyToClipboard text={sharedKey} onCopy={this.copySharedKey}>
							<Col span={shared ? 12 : 6} className={columnSeparator}>
								<Icon className={actionIcon} type="copy" />
								Shared Key
							</Col>
						</CopyToClipboard>
					) : null}

					{!shared ? (
						<Col span={6} onClick={this.handleDeleteModal} className={deleteButton}>
							<Icon className={actionIcon} type="delete" />
							Delete App
						</Col>
					) : null}
				</Row>
				<DeleteAppModal
					appName={appName}
					appId={appId}
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

export default ActionButtons;
