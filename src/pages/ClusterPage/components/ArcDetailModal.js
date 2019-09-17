import React, { Fragment } from 'react';
import {
 Modal, Button, Input, notification,
} from 'antd';
import { css } from 'emotion';
import { updateArcDetails } from '../utils';

const titleStyle = css`
	font-weight: 600;
	margin: 15px 0 5px;
`;

class ArcDetailModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			loading: false,
			username: props.arc.username,
			password: props.arc.password,
			esURL: (props.cluster && props.cluster.elasticsearch_url) || '',
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
		const { username, password, esURL } = this.state;
		const {
			cluster: { id },
		} = this.props;

		this.setState({
			loading: true,
		});

		updateArcDetails(id, {
			username,
			password,
			elasticsearch_url: esURL,
		})
			.then(() => {
				notification.success({
					title: 'Updated Details Successfully.',
				});

				this.setState({
					loading: false,
				});
				window.location.reload();
			})
			.catch((e) => {
				notification.error({
					title: 'Error while updating Details',
					description: e.message,
				});
				this.setState({
					loading: false,
				});
			});
	};

	render() {
		const {
 open, username, password, esURL, loading,
} = this.state;
		return (
			<Fragment>
				<Button size="large" icon="save" type="primary" onClick={this.handleModal}>
					Update Cluster Settings
				</Button>
				<Modal
					title="Update Cluster Settings"
					visible={open}
					okButtonProps={{
						loading,
					}}
					okText="Update Details"
					onOk={this.handleUpdate}
					onCancel={this.handleModal}
				>
					<h4 className={titleStyle}>ElasticSearch URL:</h4>
					<Input name="esURL" value={esURL} onChange={this.handleInput} />
					<h4 className={titleStyle}>Arc Username:</h4>
					<Input name="username" value={username} onChange={this.handleInput} />
					<h4 className={titleStyle}>Arc Password:</h4>
					<Input name="password" value={password} onChange={this.handleInput} />
				</Modal>
			</Fragment>
		);
	}
}

export default ArcDetailModal;
