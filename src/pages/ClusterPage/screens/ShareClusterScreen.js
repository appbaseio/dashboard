import React, { Component } from 'react';
import {
 Button, Card, Table, Modal, Input, notification,
} from 'antd';

import { getSharedUsers, addSharedUser, deleteSharedUser } from '../utils';

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
		};
	}

	componentDidMount() {
		const { clusterId } = this.props;
		getSharedUsers(clusterId)
			.then((res) => {
				const users = res.users.map(email => ({
					email,
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
		const { email, users } = this.state;

		this.setState({
			addingUser: true,
		});

		addSharedUser(clusterId, email)
			.then((res) => {
				users.push({ email });
				this.setState({
					email: '',
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
						placeholder="Enter member's email here"
						onChange={this.handleInputChange}
					/>
				</Modal>
			</div>
		);
	}
}
