import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { common } from './helper';

export default class ConfirmBox extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: this.props.showModal ? this.props.showModal : false,
			validate: false,
			inputValue: null,
		};
		this.open = this.open.bind(this);
		this.onConfirm = this.onConfirm.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
	}
	close() {
		if (this.props.onClose) {
			this.props.onClose();
		}
		this.setState({ showModal: false });
	}
	open() {
		if (this.props.onOpen) {
			this.props.onOpen();
		}
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
	getType() {
		const modaltype = this.props.type ? this.props.type : 'info';
		return `modal-${modaltype}`;
	}
	handleInputChange(event) {
		this.setState({
			inputValue: event.target.value,
			validate: event.target.value === this.props.info.validate.value,
		});
	}
	render() {
		const childrenWithProps = React.Children.map(this.props.children, child =>
			React.cloneElement(child, {
				onClick: this.open,
			}),
		);
		return (
			<div>
				{childrenWithProps}
				<Modal
					className={this.getType()}
					show={this.state.showModal}
					onHide={() => this.close()}
				>
					<Modal.Header closeButton>
						{this.props.info && this.props.info.title ? (
							<Modal.Title>{this.props.info.title}</Modal.Title>
						) : null}
					</Modal.Header>
					<Modal.Body className="clearfix">
						<div className="row">
							<div className="col-xs-12">{this.props.info.description}</div>
							{this.props.info && this.props.info.validate ? (
								<div className="col-xs-12 form-group">
									<input
										placeholder={this.props.info.validate.placeholder}
										type="text"
										className="form-control"
										defaultValue={this.state.inputValue}
										onChange={this.handleInputChange}
									/>
								</div>
							) : null}
						</div>
						<div className="col-xs-12 p-0">
							{this.props.info.buttons.confirm ? (
								<button
									className="ad-theme-btn ad-confirm-btn"
									{...common.isDisabled(
										this.props.info.validate && !this.state.validate,
									)}
									onClick={this.onConfirm}
								>
									{this.props.info.buttons.confirm}
								</button>
							) : null}
							{this.props.info.buttons.cancel ? (
								<button
									className="ad-theme-btn ad-cancel-btn"
									onClick={this.onCancel}
								>
									{this.props.info.buttons.cancel}
								</button>
							) : null}
						</div>
					</Modal.Body>
				</Modal>
			</div>
		);
	}
}

ConfirmBox.propTypes = {};

// Default props value
ConfirmBox.defaultProps = {};
