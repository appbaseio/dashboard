import React from 'react';
import { Modal, Input } from 'antd';

class DeleteClusterModal extends React.Component {
	state = {
		deleteClusterName: '',
	};

	handleDelete = () => {
		const {
			// prettier-ignore
			clusterId,
			onDelete,
			handleModal,
		} = this.props;

		onDelete(clusterId);
		handleModal();
	};

	handleInputChange = e => {
		const { name, value } = e.target;
		this.setState({
			[name]: value,
		});
	};

	render() {
		const {
			isVisible, clusterId, clusterName, handleModal,
		} = this.props; // prettier-ignore
		const { deleteClusterName } = this.state;

		let disabled = true;
		if (deleteClusterName === clusterName) {
			disabled = false;
		}

		return (
			<Modal
				visible={isVisible}
				onOk={this.handleDelete}
				onCancel={handleModal}
				destroyOnClose
				title="Confirm Delete"
				okText="Delete"
				okButtonProps={{ type: 'danger', disabled }}
			>
				<p>
					Type the cluster name{' '}
					<span style={{ fontWeight: '600' }}>{clusterName}</span>{' '}
					below to delete this cluster. This action cannot be undone.
				</p>
				<Input
					placeholder="Confirm cluster name"
					onChange={this.handleInputChange}
					value={deleteClusterName}
					name="deleteClusterName"
				/>
			</Modal>
		);
	}
}

export default DeleteClusterModal;
