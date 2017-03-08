import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';

export default class ConfirmBox extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: false,
			validate: false,
			inputValue: null
		};
		this.open = this.open.bind(this);
		this.onConfirm = this.onConfirm.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
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
	getType() {
		const modaltype = this.props.type ? this.props.type : 'info';
		return `modal-${modaltype}`;
	}
	handleInputChange(event) {
		this.setState({
			inputValue: event.target.value,
			validate: event.target.value === this.props.info.validate.value ? true : false
		});
	}
	render() {
		const childrenWithProps = React.Children.map(this.props.children,
			(child) => React.cloneElement(child, {
				onClick: this.open
			})
		);
		let disabled = null;
		if (this.props.info.validate && !this.state.validate) {
			disabled = { disabled: true };
		}
		return (
			<div>
				{childrenWithProps}
				<Modal className={this.getType()} show={this.state.showModal} onHide={() => this.close()}>
				<Modal.Header closeButton>
					<Modal.Title>{this.props.info.title}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className="row">
						<div className="col-xs-12">
							{this.props.info.description}
						</div>
						{
							this.props.info.validate ?
							(
								<div className={`col-xs-12 form-group`}>
									<input placeholder={this.props.info.validate.placeholder} type="text" className="form-control" defaultValue={this.state.inputValue} onChange={this.handleInputChange} />
								</div>
							) : null
						}
					</div>
					<div className="col-xs-12 p-0">
						<button className="ad-theme-btn ad-confirm-btn" {...disabled} onClick={this.onConfirm}>
							{this.props.info.buttons.confirm}
						</button>
						<button className="ad-theme-btn ad-cancel-btn" onClick={this.onCancel}>
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
