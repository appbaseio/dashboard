import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';

export default class ConfirmPlanChange extends Component {
	constructor(props) {
		super(props);
	}
	renderBody() {
		let markup = null;
		if(this.props.billingText) {
			markup = (
				<Modal.Body>
					<div className="final-amount">
						{this.props.billingText.finalMode} ${this.props.billingText.finalAmount}.
					</div>
					<div className="breakdown">
						<h4>Breakdown:</h4>
						{
							this.props.billingText.payment.amount ? (
								<div className="payment">
									<h5>Price for {this.props.customer.plan} plan: ${this.props.billingText.payment.amount}</h5>
									<p className="description">({this.props.billingText.payment.explain})</p>
								</div>
							) : null
						}
						{
							this.props.billingText.refund.amount ? (
								<div className="refund">
									<h5>Refund from {this.props.activePlan} plan: ${this.props.billingText.refund.amount}</h5>
									<p className="description">({this.props.billingText.refund.explain})</p>
								</div>
							) : null
						}
					</div>
				</Modal.Body>
			);
		}
		return markup;
	}
	render() {
		return (
			<Modal id="paymentModal" show={this.props.showPlanChange} onHide={() => this.props.closeModal()}>
				<Modal.Header closeButton>
					<div className="Header-logo">
						<div className="Header-logoWrap">
							<div className="Header-logoBevel"></div>
							<div className="Header-logoBorder"></div>
							<div className="Header-logoImage" style={{"backgroundImage": "url('../../../assets/images/pricing/stripeLogo.png')"}} alt="Logo"></div>
						</div>
					</div>
					<Modal.Title>appbase.io {this.props.plan} plan</Modal.Title>
					<span className="bottomline">
						charged {this.props.mode}
					</span>
				</Modal.Header>
				<div className="seprator-container">
					<div className="seprator"></div>
				</div>
				{this.renderBody()}
				<Modal.Footer>
					<button type="button" className="btn btn-primary col-xs-12 saveBtn" data-ng-disabled="loading['confirmingPlan'] === 'show'" onClick={this.props.confirmPlan}>
						<loading className="loading {{loading['confirmingPlan']}}" placeholder="Processing"></loading>
						Confirm plan change
					</button>
				</Modal.Footer>
			</Modal>
		)
	}
}

ConfirmPlanChange.propTypes = {};

// Default props value
ConfirmPlanChange.defaultProps = {}