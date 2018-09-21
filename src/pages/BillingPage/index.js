import React from 'react';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { css } from 'react-emotion';
import { Card, Row } from 'antd';
import { connect } from 'react-redux';
import Container from '../../components/Container';
import BannerHeader from '../../components/Banner/Header';
import PricingTable from '../../components/PricingTable';
import Grid from '../../components/CreateCredentials/Grid';
import Flex from '../../batteries/components/shared/Flex';
import { getAppPlanByName } from '../../batteries/modules/selectors';

const heading = css`
	font-weight: 510;
	min-width: 100px;
`;
const Billing = ({ plan, isOnTrial, planValidity }) => (
	<React.Fragment>
		<BannerHeader
			title="Upgrade your plan"
			description="Manage who can access your app data. Lorem iprum dolor sit amet lorem ipsum dolor sit. "
			component={(
<Row>
					<Flex alignItems="center">
						<Grid
							style={{
								width: '400px',
								margin: '0px',
							}}
							gridRatio={0.25}
							label={<h3 css={heading}>Plan</h3>}
							component={plan}
						/>
					</Flex>

					{planValidity && (
						<Flex alignItems="center">
							<Grid
								style={{
									width: '400px',
									margin: '0px',
									marginTop: '-35px',
								}}
								gridRatio={0.25}
								label={<h3 css={heading}>Valid till</h3>}
								component={new Date(
									planValidity + new Date().getTime(),
								).toDateString()}
							/>
						</Flex>
					)}
					{isOnTrial && (
						<Flex alignItems="center">
							<Grid
								style={{
									width: '400px',
									marginTop: '-35px',
								}}
								gridRatio={0.25}
								label={<h3 css={heading}>Trial peroid</h3>}
								component={isOnTrial ? 'Yes' : 'Expired'}
							/>
						</Flex>
					)}
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
