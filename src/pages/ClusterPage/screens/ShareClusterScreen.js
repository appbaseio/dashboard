import React, { Component } from 'react';
import {
 Button, Card, Table, Modal, Input, notification, Menu, Icon, Dropdown,
} from 'antd';
import { css } from 'emotion';

import { getSharedUsers, addSharedUser, deleteSharedUser } from '../utils';

const dropdownButtonStyles = css`
	margin-top: 8px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
`;

export default class ShareClusterScreen extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoading: true,
			addingUser: false,
			showModal: false,
			users: [],
			email: '',
			emailToDelete: '',
			role: 'viewer',
		};
	}

	componentDidMount() {
		const { clusterId } = this.props;
		getSharedUsers(clusterId)
			.then((res) => {
				const users = res.users.map(({ email, role }) => ({
					email,
					role,
				}));

				this.setState({
					users,
					isLoading: false,
				});
			})
			.catch(() => {
				this.setState({
					isLoading: false,
				});
			});
	}

	showModal = () => {
		this.setState({
			showModal: true,
		});
	};

	deleteEmail = (email) => {
		const { clusterId } = this.props;
		const { users } = this.state;

		this.setState({
			emailToDelete: email,
		});

		deleteSharedUser(clusterId, email)
			.then((res) => {
				const newUsers = users.filter(item => item.email !== email);
				this.setState({
					users: newUsers,
				});
				notification.success({
					message: 'Deleted User Successfully',
					description: res,
				});
			})
			.catch((e) => {
				notification.error({
					message: 'Some error occured',
					description: e,
				});
			});
	};

	handleInputChange = (e) => {
		this.setState({ email: e.target.value });
	};

	handleOk = () => {
		const { clusterId } = this.props;
		const { email, users, role } = this.state;

		this.setState({
			addingUser: true,
		});

		addSharedUser(clusterId, email, role)
			.then((res) => {
				users.push({ email, role });
				this.setState({
					email: '',
					role: 'viewer',
					users,
					addingUser: false,
					showModal: false,
				});
				notification.success({
					message: 'Shared Successfully',
					description: res,
				});
			})
			.catch((e) => {
				this.setState({
					email: '',
					addingUser: false,
					showModal: false,
					role: 'viewer',
				});
				notification.error({
					message: 'Some error occured',
					description: e,
				});
			});
	};

	handleCancel = () => {
		this.setState({
			showModal: false,
			email: '',
			role: 'viewer',
		});
	};

	handleRole = (e) => {
		this.setState({
			role: e.key,
		});
	};

	render() {
		const ShareBtn = (
			<Button icon="plus" onClick={this.showModal} size="large" type="primary">
				Add member
			</Button>
		);

		const {
			showModal,
			isLoading,
			users,
			role,
			email,
			emailToDelete,
			addingUser, // prettier-ignore
		} = this.state;

		const columns = [
			{
				title: 'Email',
				dataIndex: 'email',
				key: 'email',
			},
			{
				title: 'Role',
				dataIndex: 'role',
				key: 'role',
			},
			{
				title: 'Action',
				key: 'action',
				width: 250,
				render: (_, record) => (
					<span>
						{emailToDelete === record.email ? (
							'Deletion in Progress'
						) : (
							<a onClick={() => this.deleteEmail(record.email)}>Delete</a>
						)}
					</span>
				),
			},
		];

		const menu = (
			<Menu onClick={this.handleRole}>
				<Menu.Item key="admin">Admin</Menu.Item>
				<Menu.Item key="viewer">Viewer</Menu.Item>
			</Menu>
		);

		return (
			<div>
				<Card title="Share with team" extra={ShareBtn}>
					{isLoading ? (
						<div css={{ margin: 20, textAlign: 'center' }}>Loading users...</div>
					) : (
						<Table
							rowKey="email"
							columns={columns}
							dataSource={users}
							pagination={false}
						/>
					)}
				</Card>

				<Modal
					title="Share this cluster"
					visible={showModal}
					onCancel={this.handleCancel}
					footer={[
						<Button
							key="add"
							type="primary"
							loading={addingUser}
							onClick={this.handleOk}
						>
							Add
						</Button>,
					]}
				>
					<Input
						type="email"
						size="large"
						value={email}
						placeholder="Enter member's email here"
						onChange={this.handleInputChange}
					/>
					<Dropdown overlay={menu}>
						<Button size="large" className={dropdownButtonStyles}>
							{role} <Icon type="down" />
						</Button>
					</Dropdown>
				</Modal>
			</div>
		);
	}
}
