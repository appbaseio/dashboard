import React from 'react';
import { bool, string, func } from 'prop-types';
import { Modal, Input } from 'antd';
import DeleteFeedbackForm from '../../ProfilePage/DeleteFeedbackForm';
import './styles.css';

class DeleteClusterModal extends React.Component {
	state = {
		deleteClusterName: '',
		isFeedbackSubmitted: false,
	};

	handleDelete = () => {
		const { clusterId, onDelete, handleModal } = this.props;

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
			isVisible, clusterName, handleModal
		} = this.props; // prettier-ignore
		const { deleteClusterName, isFeedbackSubmitted } = this.state;

		let disabled = true;
		if (deleteClusterName === clusterName) {
			disabled = false;
		}

		return (
			<Modal
				open={isVisible}
				onOk={this.handleDelete}
				onCancel={handleModal}
				destroyOnClose
				title="Confirm Delete"
				okText="Delete"
				okButtonProps={{ type: 'danger', disabled }}
				width={600}
				bodyStyle={{
					height: isFeedbackSubmitted ? 200 : 650,
					overflow: 'scroll',
				}}
				wrapClassName="modal-styles"
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
				{!isFeedbackSubmitted ? (
					<DeleteFeedbackForm
						setIsFeedbackSubmitted={() =>
							this.setState({
								isFeedbackSubmitted: true,
							})
						}
					/>
				) : (
					<h3 className="success-message-container">
						Thank you for providing this feedback{' '}
						<span role="img" aria-label="feedback">
							🙏
						</span>
					</h3>
				)}
			</Modal>
		);
	}
}

DeleteClusterModal.propTypes = {
	isVisible: bool,
	clusterName: string,
	handleModal: func,
	clusterId: string,
	onDelete: func,
};

export default DeleteClusterModal;
