import React from 'react';
import { Button, Popconfirm, Tooltip, notification } from 'antd';
import { css } from 'react-emotion';
import { object, func } from 'prop-types';
import get from 'lodash/get';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Flex from '../../batteries/components/shared/Flex';

const EyeIcon = require('react-feather/dist/icons/eye').default;
const EyeOffIcon = require('react-feather/dist/icons/eye-off').default;
const CopyIcon = require('react-feather/dist/icons/copy').default;
const EditIcon = require('react-feather/dist/icons/edit').default;
const DeleteIcon = require('react-feather/dist/icons/trash-2').default;

const main = css`
	.ant-btn {
		border: transparent;
		margin-left: 5px;
		padding: 0 5px;
	}
`;
const container = css`
	border: 1px solid #e8e8e8;
	padding: 2px 10px;
	.ant-btn {
		border: transparent;
		background-color: transparent;
		margin-left: 5px;
		padding: 0 5px;
	}
	width: 500px;
`;
class Permission extends React.Component {
	state = {
		viewKey: false,
	};

	get key() {
		const { permissionInfo } = this.props;
		return `${get(permissionInfo, 'username')}:${get(
			permissionInfo,
			'password',
		)}`;
	}

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

	handleEditCred = () => {
		const { permissionInfo, showForm } = this.props;
		const formPayload = {
			description: permissionInfo.description,
			read: permissionInfo.read,
			write: permissionInfo.write,
			acl: permissionInfo.acl,
			referers: permissionInfo.referers,
			sources: permissionInfo.sources,
			include_fields: permissionInfo.include_fields,
			exclude_fields: permissionInfo.exclude_fields,
			ip_limit: permissionInfo.ip_limit,
			ttl: permissionInfo.ttl,
			meta: {
				username: permissionInfo.username,
			},
		};
		showForm(formPayload);
	};

	handleDeleteCred = async () => {
		const { permissionInfo, deletePermission } = this.props;
		deletePermission(permissionInfo.username);
	};

	render() {
		const { viewKey } = this.state;
		const {
			permissionInfo: { description },
		} = this.props;
		let tutorialClass = '';
		if (description.toLowerCase().includes('admin')) {
			tutorialClass = 'credentials-tutorial-4';
		} else if (description.toLowerCase().includes('read')) {
			tutorialClass = 'credentials-tutorial-3';
		}
		return (
			<Flex css={main} alignItems="center">
				<Flex
					justifyContent="space-between"
					alignItems="center"
					css={container}
				>
					<span>
						{viewKey
							? this.key
							: '########################################'}
					</span>
					<Flex>
						<Tooltip
							placement="topLeft"
							title={
								viewKey
									? 'Hide credentials'
									: 'View credentials'
							}
						>
							<Button
								onClick={this.handleViewClick}
								type="normal"
							>
								{viewKey ? (
									<EyeOffIcon size={16} />
								) : (
									<EyeIcon size={16} />
								)}
							</Button>
						</Tooltip>
						<CopyToClipboard
							text={this.key}
							onCopy={this.handleCopyCred}
						>
							<Tooltip
								placement="topLeft"
								title="Copy To Clipboard"
							>
								<Button type="normal" className={tutorialClass}>
									<CopyIcon size={16} />
								</Button>
							</Tooltip>
						</CopyToClipboard>
						<Tooltip placement="topLeft" title="Edit credentials">
							<Button
								onClick={this.handleEditCred}
								className="credentials-tutorial-2"
								type="normal"
							>
								<EditIcon size={16} />
							</Button>
						</Tooltip>
					</Flex>
				</Flex>
				<Popconfirm
					title="Are you sure delete this key?"
					onConfirm={this.handleDeleteCred}
					okText="Yes"
					cancelText="No"
				>
					<Button type="danger">
						<DeleteIcon size={16} />
					</Button>
				</Popconfirm>
			</Flex>
		);
	}
}

Permission.propTypes = {
	permissionInfo: object.isRequired,
	showForm: func.isRequired,
	deletePermission: func.isRequired,
};

export default Permission;
