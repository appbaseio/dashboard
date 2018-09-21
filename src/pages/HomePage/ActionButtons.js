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

	handleClone = (e) => {
		const { appName, appId, permissions } = this.props;
		const { username, password } = permissions.results[0];
		const parameters = {
			platform: 'appbase',
			importFrom: {
				appname: appName,
				hosturl: `https://${username}:${password}@${SCALR_URL}`,
			},
		};
		window.open(`${IMPORTER_LINK}${JSON.stringify(parameters)}`, '_blank');
		e.stopPropagation();
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

	render() {
		const { appName, appId, shared } = this.props;
		const { deleteModal } = this.state;

		const readKey = this.getReadKey();
		const writeKey = this.getWriteKey();

		return (
			<div className="card-actions" key={appName}>
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
								<Icon className={actionIcon} type="edit" />
								Write Key
							</Col>
						</CopyToClipboard>
					) : null}

					{readKey ? (
						<CopyToClipboard text={readKey} onCopy={this.copyReadKey}>
							<Col span={shared ? 12 : 6} className={columnSeparator}>
								<Icon className={actionIcon} type="file-text" />
								Read Key
							</Col>
						</CopyToClipboard>
					) : (
						<Col
							span={shared ? 12 : 6}
							style={{ cursor: 'not-allowed' }}
							className={columnSeparator}
						>
							No Read Key
						</Col>
					)}

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

HomePage.propTypes = {
	shared: PropTypes.bool.isRequired,
	appName: PropTypes.string.isRequired,
	appId: PropTypes.number.isRequired,
	permissions: PropTypes.object.isRequired,
};

export default ActionButtons;
