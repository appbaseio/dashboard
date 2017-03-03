import React,{ Component } from 'react';
import { Modal } from 'react-bootstrap';

export default class DeleteApp extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: false
		};
	}
	close() {
		this.setState({ showModal: false });
	}
	open() {
		this.setState({ showModal: true });
	}
	deleteApp() {
		this.close();
		this.props.deleteApp(this.props.app);
	}
	render() {
		return (
		<div>
			<a title="Delete app" className="delete pointer text-danger" onClick={() => this.open()}>
				<i className="fa fa-trash"></i>
			</a>
			<Modal className="modal-info" show={this.state.showModal} onHide={() => this.close()}>
			<Modal.Header closeButton>
				<Modal.Title>Delete App</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className="row">
					<div className="col-xs-12">
						<p>Do you want to delete <strong>{this.props.app.name}</strong>?</p>
					</div>
				</div>
				<div className="col-xs-12 text-center">
					<button className="btn btn-primary" onClick={() => this.deleteApp()}>
						confirm
					</button>
				</div>
				</Modal.Body>
			</Modal>
		</div>
		)
	}
}
