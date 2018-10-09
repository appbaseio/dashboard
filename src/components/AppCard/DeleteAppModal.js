import React from 'react';
import { Modal, Input, message } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { deleteApp } from '../../utils';
import { removeAppData } from '../../actions';

class DeleteAppModal extends React.Component {
	state = {
		deleteAppName: '',
		loading: false,
	};

	handleDelete = () => {
		const {
			// prettier-ignore
			appId,
			appName,
			handleDeleteModal,
			handleRemoveApp,
		} = this.props;

		deleteApp(appId)
			.then(() => {
				handleRemoveApp(appName);
				handleDeleteModal();
				message.success(`${appName} deleted`);
			})
			.catch(() => {
				message.error('Something went wrong. Try again.');
			});

		this.setState({
			loading: true,
		});
	};

	handleInputChange = (e) => {
		const { name, value } = e.target;
		this.setState({
			[name]: value,
		});
	};

	render() {
		const { deleteModal, appName, handleDeleteModal } = this.props;
		const { deleteAppName, loading } = this.state;

		let disabled = true;
		if (deleteAppName === appName) {
			disabled = false;
		}

		return (
			<Modal
				visible={deleteModal}
				onOk={this.handleDelete}
				onCancel={handleDeleteModal}
				destroyOnClose
				title="Confirm Delete"
				okText="Delete"
				okButtonProps={{ type: 'danger', disabled, loading }}
			>
				<p>
					Type the app name <span style={{ fontWeight: '600' }}>{appName}</span> below to
					delete the app. This action cannot be undone.
				</p>
				<Input
					placeholder="Confirm appname"
					onChange={this.handleInputChange}
					value={deleteAppName}
					name="deleteAppName"
				/>
			</Modal>
		);
	}
}

DeleteAppModal.propTypes = {
	deleteModal: PropTypes.bool.isRequired,
	appId: PropTypes.string.isRequired,
	appName: PropTypes.string.isRequired,
	handleDeleteModal: PropTypes.func.isRequired,
	handleRemoveApp: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
	handleRemoveApp: options => dispatch(removeAppData(options)),
});

export default connect(
	null,
	mapDispatchToProps,
)(DeleteAppModal);
