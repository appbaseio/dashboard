import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';

export default class ConfirmBox extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: false
		};
		this.open = this.open.bind(this);
		this.onConfirm = this.onConfirm.bind(this);
		this.onCancel = this.onCancel.bind(this);
	}
	close() {
		this.setState({ showModal: false });
	}
	open() {
		this.setState({ showModal: true });
	}
	onConfirm() {
		if (this.props.onConfirm) {
			this.props.onConfirm();
		}
		this.close();
	}
	onCancel() {
		if (this.props.onCancel) {
			this.props.onCancel();
		}
		this.close();
	}
	render() {
		const childrenWithProps = React.Children.map(this.props.children,
			(child) => React.cloneElement(child, {
				onClick: this.open
			})
		);
		return (
			<div>
				{childrenWithProps}
				<Modal className="modal-info" show={this.state.showModal} onHide={() => this.close()}>
				<Modal.Header closeButton>
					<Modal.Title>{this.props.info.title}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className="row">
						<div className="col-xs-12">
							{this.props.info.description}
						</div>
					</div>
					<div className="col-xs-12 text-center">
						<button className="btn btn-primary" onClick={this.onConfirm}>
							{this.props.info.buttons.confirm}
						</button>
						<button className="btn btn-primary" onClick={this.onCancel}>
							{this.props.info.buttons.cancel}
						</button>
					</div>
					</Modal.Body>
				</Modal>
			</div>
		)
	}
}

ConfirmBox.propTypes = {};

// Default props value
ConfirmBox.defaultProps = {}