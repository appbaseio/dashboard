import React from 'react';
import DeleteFeedbackForm from '../../ProfilePage/DeleteFeedbackForm';
import { Modal, Input } from 'antd';

class DeleteClusterModal extends React.Component {
	state = {
		deleteClusterName: '',
		isFeedbackSubmitted: false,
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
			isVisible, clusterId, clusterName, handleModal, isFeedbackSubmitted
		} = this.props; // prettier-ignore
		const { deleteClusterName } = this.state;

		let disabled = true;
		if (deleteClusterName === clusterName && isFeedbackSubmitted) {
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
				bodyStyle={{ height: 500, overflow: 'scroll' }}
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
				<DeleteFeedbackForm
					setIsFeedbackSubmitted={() =>
						this.setState({
							setIsFeedbackSubmitted: true,
						})
					}
				/>
			</Modal>
		);
	}
}

export default DeleteClusterModal;
