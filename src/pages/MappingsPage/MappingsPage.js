import React, { Fragment } from 'react';
import {
 Row, Col, Button, Icon,
} from 'antd';
import { string, bool, number } from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';

import Header from '../../components/Header';
import Mappings from '../../batteries/components/Mappings';
import { getAppPlanByName } from '../../batteries/modules/selectors';

const MappingsPage = ({
 appName, appId, isPaidUser, isUsingTrial, trialValidity,
}) => (
	<Fragment>
		<Header compact>
			<Row type="flex" justify="space-between" gutter={16}>
				<Col lg={18}>
					<h2>Manage Mappings</h2>

					<Row>
						<Col lg={18}>
							<p>
								View mappings, edit use-case and data types, add or delete fields -{' '}
								<a
									href="https://docs.appbase.io/concepts/mappings.html"
									target="_blank"
									rel="noopener noreferrer"
								>
									learn more
								</a>
								.
							</p>
						</Col>
					</Row>
				</Col>
				{isPaidUser /* eslint-disable-line */ ? (
					isUsingTrial ? (
						<Col
							lg={6}
							css={{
								display: 'flex',
								flexDirection: 'column-reverse',
								paddingBottom: 20,
							}}
						>
							<Button
								size="large"
								type="primary"
								href="https://appbase.io/pricing"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Icon type="info-circle" />
								Upgrade Now
							</Button>
							<p
								css={{
									marginTop: 20,
									fontSize: 13,
									textAlign: 'center',
									lineHeight: '20px',
								}}
							>
								<strong>Trial expires in {trialValidity} days</strong>
							</p>
						</Col>
					) : null
				) : (
					<Col
						lg={6}
						css={{
							display: 'flex',
							flexDirection: 'column-reverse',
							paddingBottom: 20,
						}}
					>
						<Button
							size="large"
							type="primary"
							href="https://appbase.io/pricing#features"
							target="_blank"
							rel="noopener noreferrer"
						>
							<Icon type="info-circle" />
							Requires A Paid Plan
						</Button>
					</Col>
				)}
			</Row>
		</Header>
		<section>
			<Mappings key={appName} appName={appName} appId={appId} />
		</section>
	</Fragment>
);

MappingsPage.propTypes = {
	appName: string.isRequired,
	appId: string.isRequired,
	isPaidUser: bool.isRequired,
	isUsingTrial: bool.isRequired,
	trialValidity: number.isRequired,
};

const mapStateToProps = (state) => {
	const appPlan = getAppPlanByName(state);
	return {
		isPaidUser: get(appPlan, 'isPaid') || false,
		isUsingTrial: get(appPlan, 'trial') || false,
		trialValidity: get(appPlan, 'daysLeft'), // eslint-disable-line
	};
};

export default connect(mapStateToProps)(MappingsPage);
