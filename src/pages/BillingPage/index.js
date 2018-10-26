import React from 'react';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { Card, Row, Col } from 'antd';
import { connect } from 'react-redux';
import Container from '../../components/Container';
import BannerHeader from '../../components/Banner/Header';
import PricingTable from '../../components/PricingTable';
import { capitalizePlan } from '../../utils/helper';
import { getAppPlanByName } from '../../batteries/modules/selectors';

const Billing = ({ plan, isOnTrial, planValidity }) => (
	<React.Fragment>
		<BannerHeader
			title="Billing"
			component={(
<Row>
					<Col>
						<p>Transparent pricing that scales with you.</p>
						<p>
							Your plan is <strong>{capitalizePlan(plan)}</strong>{' '}
							{planValidity ? (
								<span>
									Valid till{' '}
									<strong>{new Date(planValidity * 1000).toDateString()}</strong>.
								</span>
							) : null}
						</p>
						{isOnTrial ? <p>You are on trial.</p> : null}
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

Billing.propTypes = {
	plan: PropTypes.string.isRequired,
	planValidity: PropTypes.number.isRequired,
	isOnTrial: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
	const appPlan = getAppPlanByName(state);
	return {
		plan: get(appPlan, 'tier'),
		planValidity: get(appPlan, 'tier_validity'),
		isOnTrial: get(appPlan, 'trial'),
	};
};

export default connect(mapStateToProps)(Billing);
