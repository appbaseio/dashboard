import React, { Fragment } from 'react';
import { Modal, Button, Input } from 'antd';

class ArcDetailModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			isUpdating: false,
			username: props.username,
			password: props.password,
		};
	}

	handleModal = () => {
		this.setState(prevState => ({
			open: !prevState.open,
		}));
	};

	handleInput = (e) => {
		this.setState({
			[e.target.name]: e.target.value,
		});
	};

	handleUpdate = () => {
		// Add updating Logic here

		this.handleModal();
	};

	render() {
		const { open, username, password } = this.state;
		return (
			<Fragment>
				<Button size="large" icon="save" type="primary" onClick={this.handleModal}>
					Update Cluster Settings
				</Button>
				<Modal
					title="Update Cluster Settings"
					visible={open}
					onOk={this.handleUpdate}
					onCancel={this.handleModal}
				>
					<Input name="username" value={username} onChange={this.handleInput} />
					<Input name="password" value={password} onChange={this.handleInput} />
				</Modal>
			</Fragment>
		);
	}
}

export default ArcDetailModal;
