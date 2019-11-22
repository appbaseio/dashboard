import React, { Component } from 'react';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { Card, Row, Col } from 'antd';
import { connect } from 'react-redux';
import Stripe from 'react-stripe-checkout';
import styled from 'react-emotion';
import Container from '../../components/Container';
import BannerHeader from '../../components/Banner/Header';
import PricingTable from '../../components/PricingTable';
import { capitalizePlan, displayErrors } from '../../utils/helper';
import { getAppPlanByName } from '../../batteries/modules/selectors';
import { updateAppPaymentMethod } from '../../batteries/modules/actions';
import Loader from '../../batteries/components/shared/Loader';
import { STRIPE_KEY } from '../../constants';

const TextLink = styled('span')`
	color: rgb(111, 99, 245);
	font-weight: 600;
	text-decoration: underline;
	cursor: pointer;
`;

class Billing extends Component {
	componentDidUpdate(prevProps) {
		const { errors } = this.props;
		displayErrors(errors, prevProps.errors, true);
	}

	render() {
		// prettier-ignore
		const {
			plan,
			isOnTrial,
			planValidity,
			updatePayment,
			isLoading,
		} = this.props;
		if (isLoading) {
			return <Loader show message="Updating Payment Method... Please wait!" />;
		}
		return (
			<React.Fragment>
				<BannerHeader
					title="Appbase.io Billing"
					component={(
						<Row>
							<Col>
								<p>Transparent pricing that scales with you.</p>
								<p>
									You are currently on the <strong>{capitalizePlan(plan)}</strong>{' '}
									plan.{' '}
									{planValidity ? (
										<span>
											Valid till{' '}
											<strong>
												{new Date(planValidity * 1000).toDateString()}
											</strong>
											.
										</span>
									) : null}
								</p>
								{isOnTrial ? <p>You are currently in trial mode.</p> : null}
								<Stripe
									stripeKey={STRIPE_KEY.LIVE}
									panelLabel="Update Payment"
									token={updatePayment}
								>
									<TextLink>Update Payment Method</TextLink>
								</Stripe>
							</Col>
						</Row>
					)}
				/>
				<Container>
					<Card bodyStyle={{ padding: 0 }}>
						<PricingTable />
					</Card>
				</Container>
			</React.Fragment>
		);
	}
}

Billing.propTypes = {
	plan: PropTypes.string.isRequired,
	planValidity: PropTypes.number.isRequired,
	isOnTrial: PropTypes.bool.isRequired,
	updatePayment: PropTypes.func.isRequired,
	isLoading: PropTypes.bool.isRequired,
	errors: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => {
	const appPlan = getAppPlanByName(state);
	return {
		plan: get(appPlan, 'tier'),
		planValidity: get(appPlan, 'tier_validity'),
		isOnTrial: get(appPlan, 'trial'),
		isLoading: get(state, '$updateAppPaymentMethod.isFetching'),
		errors: [get(state, '$updateAppPaymentMethod.error')],
	};
};

const mapDispatchToProps = dispatch => ({
	updatePayment: token => dispatch(updateAppPaymentMethod(token, 'APP')),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Billing);
