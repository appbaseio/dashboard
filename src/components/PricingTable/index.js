import React, { Component } from 'react';
import styled, { css } from 'react-emotion';
import { Check } from 'react-feather';
import { connect } from 'react-redux';
import Stripe from 'react-stripe-checkout';
import {
	Tooltip, Modal, Button,
} from 'antd';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import AppButton from './AppButton';
import Loader from '../../batteries/components/shared/Loader';
import PlusMinus from './PlusMinus';
import NewPricingCard from './NewPricingCard';
import theme from './theme';
import { media, hexToRgb } from '../../utils/media';
import { getParam } from '../../utils';
import { planBasePrice, displayErrors } from '../../utils/helper';
import { createAppSubscription, deleteAppSubscription, getAppPlan } from '../../batteries/modules/actions';
import { getAppPlanByName } from '../../batteries/modules/selectors';

const CheckList = ({ list }) => list.map(item => (
		<li key={item}>
			<Check css={{ marginRight: '6px', fontWeight: 'strong' }} width="15" height="15" />{' '}
			{item}
		</li>
	));

const hideOnLarge = css`
	${media.ipadPro(css`
		display: none;
	`)};
	margin: 50px auto;
	user-select: none;
`;

const showOnLarge = css`
	display: none;
	${media.ipadPro(css`
		display: flex;
	`)};
	user-select: none;
`;

const Title = styled('div')`
	font-size: 20px;
	font-weight: bold;
	line-height: 27px;
	text-align: center;
	margin-bottom: 25px;
`;

const Price = styled('div')`
	height: 54px;
	font-family: 'Open Sans';
	font-size: 36px;
	line-height: 26px;
	text-align: center;
	margin: 0 auto 20px auto;
	> small {
		font-family: 'Open Sans';
		font-size: 12px;
		font-weight: 400;
		line-height: 22px;
		text-align: center;
		padding-left: 4rem;
	}
`;

const Table = styled('table')`
	text-align: center;
	border-collapse: separate;
	border-spacing: 16px 0px;

	> thead > tr {
		&:nth-child(1) {
			> td {
				padding-top: 30px;
				vertical-align: top;
			}
		}
	}
	> thead > tr > td,
	> tbody > tr > td {
		width: 205px;
		border: 1.5px solid #f4f4f4;
		border-bottom: 0;
		padding: 11px 2px;
		font-size: 18px;
		font-weight: 400;
		line-height: 22px;
		text-align: center;

		&:nth-child(1) {
			min-width: 240px;
			border-color: transparent;
			text-align: left;
			font-size: 20px;
			font-weight: 400;
			line-height: 27px;
			> span {
				padding-bottom: 0px;
				border-bottom-style: dashed;
				border-bottom-width: 3px;
				a {
					text-decoration: none;
					color: inherit;
				}
			}
		}

		&:nth-child(3) {
			border-color: ${theme.badge.blue};
			background: ${theme.badge.blue};
			color: #ffffff;
		}
		&:nth-child(4) {
			border-color: ${theme.badge.darkBlue};
			background: ${theme.badge.darkBlue};
			color: #ffffff;
		}
		&:nth-child(5) {
			border-color: ${theme.badge.red};
			background: ${theme.badge.red};
			color: #ffffff;
		}
	}
	> tbody > tr {
		text-align: left;
		&:hover {
			td {
				&:nth-child(1) {
					border-color: ${hexToRgb('#ECECEC', 0.21)};
					background: ${hexToRgb('#ECECEC', 0.21)};
				}
				&:nth-child(2) {
					border-color: ${hexToRgb('#ECECEC', 0.21)};
					background: ${hexToRgb('#ECECEC', 0.21)};
				}
				&:nth-child(3) {
					border-color: ${hexToRgb(theme.badge.blue, 0.79)};
					background: ${hexToRgb(theme.badge.blue, 0.79)};
				}
				&:nth-child(4) {
					border-color: ${hexToRgb(theme.badge.darkBlue, 0.79)};
					background: ${hexToRgb(theme.badge.darkBlue, 0.79)};
				}
				&:nth-child(5) {
					border-color: ${hexToRgb(theme.badge.red, 0.79)};
					background: ${hexToRgb(theme.badge.red, 0.79)};
				}
			}
		}
		> td {
			border-top: 0;
		}

		> td:nth-child(1) {
			border-top: 1.5px;
		}
		&:last-child {
			> td {
				&:nth-child(2) {
					border-bottom: 1.5px #f4f4f4 solid;
				}
			}
		}
	}
`;

const Caption = styled('div')`
	color: ${hexToRgb('#232e44', 0.6)};
	font-size: 12px;
	font-weight: 400;
	line-height: 17px;
	text-align: center;
	text-decoration: none !important;
`;

const ListCaption = styled('div')`
	margin-top: 13px;
	color: ${hexToRgb('#FFFFFF', 0.8)};
	font-size: 0.875rem;
	font-weight: 400;
	line-height: 17px;
	text-align: left;
	text-decoration: none !important;
	text-transform: uppercase;
	margin-left: 3px;
`;

const HeadingTr = css`
	height: 100px;
	&:hover {
		td {
			&:nth-child(1) {
				border-color: ${hexToRgb('#FFFFFF', 1)} !important;
				background: ${hexToRgb('#FFFFFF', 1)} !important;
			}
			&:nth-child(2) {
				border-color: ${hexToRgb('#f4f4f4', 1)} !important;
				background: ${hexToRgb('#FFFFFF', 1)} !important;
			}
			&:nth-child(3) {
				border-color: ${hexToRgb(theme.badge.blue, 1)} !important;
				background: ${hexToRgb(theme.badge.blue, 1)} !important;
			}
			&:nth-child(4) {
				border-color: ${hexToRgb(theme.badge.darkBlue, 1)} !important;
				background: ${hexToRgb(theme.badge.darkBlue, 1)} !important;
			}
			&:nth-child(5) {
				border-color: ${hexToRgb(theme.badge.red, 1)} !important;
				background: ${hexToRgb(theme.badge.red, 1)} !important;
			}
		}
	}
	td {
		color: ${hexToRgb('#232e44', 0.5)};
		font-size: 16px !important;
		font-weight: 600 !important;
		line-height: 28px !important;
		text-transform: uppercase;
		text-decoration: none !important;
		padding-bottom: 20px !important;
		> small {
			display: block;
			clear: both;
			color: #232e44;
			font-size: 12px;
			line-height: 17px;
			text-transform: none;
			font-weight: 400;
			a {
				color: inherit;
			}
		}
	}
`;

class PricingTable extends Component {
	constructor(props) {
		super(props);

		const bootstrap = {
			records: [],
			apiCalls: [],
			basePrice: planBasePrice.bootstrap,
		};

		const growth = {
			records: [],
			apiCalls: [],
			basePrice: planBasePrice.growth,
		};

		for (let i = 1; i <= 20; i += 1) {
			const val = i * 50;
			bootstrap.records.push(`${val === 1000 ? '1M' : `${val}K`}`);
			bootstrap.apiCalls.push(`${i}M`);
			growth.records.push(`${i}M`);
			growth.apiCalls.push(`${i * 10}M`);
		}

		this.plans = { bootstrap, growth };
		this.state = {
			bootstrap: {
				record: 0,
				apiCall: 0,
			},
			growth: {
				record: 0,
				apiCall: 0,
			},
			active: undefined,
			plans: this.plans,
			showConfirmBox: false,
		};
		// test key
		// this.stripeKey = 'pk_test_DYtAxDRTg6cENksacX1zhE02';
		// live key
		this.stripeKey = 'pk_live_ihb1fzO4h1ykymhpZsA3GaQR';
	}

	componentDidMount() {
		const plan = getParam('plan', window.location.search) || null;
		setTimeout(() => {
			this.setState({
				selectedPlan: plan,
			});
		}, 500);
	}

	componentDidUpdate(prevProps) {
		const { errors } = this.props;
		displayErrors(errors, prevProps.errors);
	}

	get getText() {
		const { active } = this.state;
		if (active) {
			if (active === 'bootstrap' && this.calcPrice('bootstrap') > this.calcPrice('growth')) {
				return 'Growth plan will be cheaper.';
			}
			return 'Plan scales as usage.';
		}
		return undefined;
	}

	handleToken = (token, plan) => {
		const { createSubscription, fetchAppPlan } = this.props;
		createSubscription(token, plan).then(({ payload }) => {
			if (payload) {
				fetchAppPlan();
			}
		});
	};

	deleteSubscription = () => {
		const { deleteSubscription, fetchAppPlan } = this.props;
		deleteSubscription().then(({ payload }) => {
			if (payload) {
				fetchAppPlan();
				this.cancelConfirmBox();
			}
		});
	}

	showConfirmBox = () => {
		this.setState({
			showConfirmBox: true,
		});
	}

	cancelConfirmBox = () => {
		this.setState({
			showConfirmBox: false,
		});
	}

	calcPrice(planName) {
		const { plans } = this.state;
		const { basePrice } = plans[planName];
		// eslint-disable-next-line
		const { record, apiCall } = this.state[planName];

		let recordIncrement = 5;
		let apiIncrement = 5;
		if (planName === 'growth') {
			recordIncrement = 50;
			apiIncrement = 50;
		}
		const incrementedRecord = record * recordIncrement;
		const incrementedApiCall = apiCall * apiIncrement;
		return basePrice + incrementedRecord + incrementedApiCall;
	}

	render() {
		const {
			plans,
			bootstrap,
			growth,
			active,
			showConfirmBox,
			selectedPlan,
		} = this.state;
		const {
			isFreePlan,
			isBootstrapPlan,
			isGrowthPlan,
			isSubmitting,
			isLoading,
		} = this.props;
		if (isLoading) {
			return <Loader show message="Updating Plan... Please wait!" />;
		}
		return (
			<React.Fragment>
				<Modal
					title="Delete Subscription"
					visible={showConfirmBox}
					onCancel={this.cancelConfirmBox}
					footer={[
						<Button key="back" onClick={this.cancelConfirmBox}>
							Cancel
						</Button>,
						<Button
							loading={isSubmitting}
							key="submit"
							type="primary"
							onClick={this.deleteSubscription}
						>
							Unsubscribe
						</Button>,
					]}
				>
					<p>Are you sure to unsubscribe current subscription?</p>
				</Modal>
				<Table className={hideOnLarge}>
					<thead>
						<tr colSpan="1">
							<td>
								<Tooltip title="hey bro" />
							</td>
							<td>
								<Title>FREE</Title>
								<Price>
									$0
									<br />
									<small>/month</small>
								</Price>
								<Caption>
									<a href="https://appbase.io/static/poweredby_logo_placement.zip">
										Requires appbase.io logo placement
									</a>
								</Caption>
							</td>
							<td>
								<Title>BOOTSTRAP</Title>
								<Price>
									${this.calcPrice('bootstrap')}
									<br />
									<small>/month</small>
								</Price>
							</td>
							<td>
								<Title>GROWTH</Title>
								<Price>
									${this.calcPrice('growth')}
									<br />
									<small>/month</small>
								</Price>
							</td>
						</tr>
					</thead>
					<tbody>
						<tr className={HeadingTr}>
							<td>Core Platform</td>
							<td />
							<td>{active === 'bootstrap' && this.getText}</td>
							<td>{active === 'growth' && this.getText}</td>
						</tr>
						<tr>
							<td>
								<Tooltip
									placement="rightTop"
									title="A record (aka document) holds one object stored as a JSON into the database."
								>
									Records
								</Tooltip>
							</td>
							<td>10K</td>
							<td>
								<PlusMinus
									values={plans.bootstrap.records}
									onChange={(value, index) => {
										this.setState({
											active: 'bootstrap',
											bootstrap: Object.assign(bootstrap, { record: index }),
										});
									}}
								/>
							</td>
							<td>
								<PlusMinus
									values={plans.growth.records}
									onChange={(value, index) => {
										this.setState({
											active: 'growth',
											growth: Object.assign(growth, {
												record: index,
											}),
										});
									}}
								/>
							</td>
						</tr>
						<tr>
							<td>
								<Tooltip
									placement="rightTop"
									title="One API call is a read, write, update, search or a streaming response."
								>
									API Calls
								</Tooltip>
							</td>
							<td>100K</td>
							<td>
								<PlusMinus
									values={plans.bootstrap.apiCalls}
									onChange={(value, index) => {
										this.setState({
											bootstrap: Object.assign(bootstrap, { apiCall: index }),
											active: 'bootstrap',
										});
									}}
								/>
							</td>
							<td>
								<PlusMinus
									values={plans.growth.apiCalls}
									onChange={(value, index) => {
										this.setState({
											growth: Object.assign(growth, {
												apiCall: index,
											}),
											active: 'growth',
										});
									}}
								/>
							</td>
						</tr>
						<tr className={HeadingTr}>
							<td>FEATURES</td>
							<td />
							<td />
							<td />
						</tr>
						<tr>
							<td>
								<Tooltip
									placement="rightTop"
									title="Invite team members and collaborate together on your app."
								>
									Team Access
								</Tooltip>
							</td>
							<td>-</td>
							<td>
								<Check />
							</td>
							<td>
								<Check />
							</td>
						</tr>
						<tr>
							<td>
								<Tooltip
									placement="rightTop"
									title="Set fine-grained access control policies per API key. Secure using HTTP Referers, IP sources and more."
								>
									<span>
										<a
											href="https://appbase.io/pricing#features"
											target="_blank"
											rel="noopener noreferrer"
										>
											ACLs & Security
										</a>
									</span>
								</Tooltip>
							</td>
							<td>-</td>
							<td>Basic</td>
							<td>Included</td>
						</tr>
						<tr>
							<td>
								<Tooltip
									placement="rightTop"
									title="Edit your app schema on the fly without worrying about data loss."
								>
									<span>
										<a
											href="https://appbase.io/pricing#features"
											target="_blank"
											rel="noopener noreferrer"
										>
											Editable Mappings
										</a>
									</span>
								</Tooltip>
							</td>
							<td>-</td>
							<td>
								<Check />
							</td>
							<td>
								<Check />
							</td>
						</tr>
						<tr>
							<td>
								<Tooltip
									placement="rightTop"
									title="Test-drive and tune your search relevancy without breaking a sweat."
								>
									<span>
										<a
											href="https://appbase.io/pricing#features"
											target="_blank"
											rel="noopener noreferrer"
										>
											Search Sandbox
										</a>
									</span>
								</Tooltip>
							</td>
							<td>Basic</td>
							<td>1 Profile</td>
							<td>3 Profiles</td>
						</tr>
						<tr>
							<td>
								<Tooltip
									placement="rightTop"
									title="Get actionable analytics on popular searches, no result searches and clicks and conversions."
								>
									<span>
										<a
											href="https://appbase.io/pricing#features"
											target="_blank"
											rel="noopener noreferrer"
										>
											Analytics
										</a>
									</span>
								</Tooltip>
							</td>
							<td>-</td>
							<td>7 days Retention</td>
							<td>30 days Retention</td>
						</tr>
						<tr>
							<td>
								<Tooltip
									placement="rightTop"
									title="Create app, API keys, edit mappings and get analytics and insights via API."
								>
									<span>Accounts API</span>
								</Tooltip>
							</td>
							<td>-</td>
							<td>-</td>
							<td>
								<Check />
							</td>
						</tr>
						<tr className={HeadingTr}>
							<td>
								Support and Guidance
								<small>
									<a
										href="https://appbase.io/pricing#support"
										target="_blank"
										rel="noopener noreferrer"
									>
										Get premium support and business SLAs
									</a>
								</small>
							</td>
							<td />
							<td />
							<td />
						</tr>
						<tr>
							<td>
								<Tooltip
									placement="rightTop"
									title="Support on core platform features."
								>
									Platform Support
								</Tooltip>
							</td>
							<td>Community</td>
							<td>Email</td>
							<td>Email</td>
						</tr>
						<tr>
							<td>
								<Tooltip
									placement="rightTop"
									title="Support on non-core libraries, tools and open-source projects."
								>
									Tools Support
								</Tooltip>
							</td>
							<td>Community</td>
							<td>Basic</td>
							<td>Priority</td>
						</tr>
						<tr>
							<td>
								<Tooltip
									placement="rightTop"
									title="One time support on getting started, migrations and setup."
								>
									<span>
										<a
											href="https://appbase.io/pricing#support"
											target="_blank"
											rel="noopener noreferrer"
										>
											Onboarding Support
										</a>
									</span>
								</Tooltip>
							</td>
							<td>-</td>
							<td>Can be added</td>
							<td>Can be added</td>
						</tr>
						<tr>
							<td>
								<Tooltip
									placement="rightTop"
									title="1:1 reviews with an engineer on data modeling, best practices and scaling."
								>
									<span>
										<a
											href="https://appbase.io/pricing#support"
											target="_blank"
											rel="noopener noreferrer"
										>
											Architecture Reviews
										</a>
									</span>
								</Tooltip>
							</td>
							<td>-</td>
							<td>Can be added</td>
							<td>Can be added</td>
						</tr>
						<tr>
							<td>
								<Tooltip
									placement="rightTop"
									title="Get dedicated onsite support with 1-day SLAs."
								>
									<span>
										<a
											href="https://appbase.io/pricing#support"
											target="_blank"
											rel="noopener noreferrer"
										>
											Premium Support
										</a>
									</span>
								</Tooltip>
							</td>
							<td>-</td>
							<td>Can be added</td>
							<td>Can be added</td>
						</tr>
					</tbody>
					<tfoot>
						<tr>
							<td />
							<td>
								<Stripe
									name="Appbase.io Free Plan"
									amount={0}
									token={token => this.handleToken(token, 'free')}
									disabled={isFreePlan}
									stripeKey={this.stripeKey}
								>
									<AppButton
										uppercase
										big
										bold
										shadow
										color={theme.colors.accentText}
										backgroundColor={theme.colors.accent}
										css={{ marginTop: 40 }}
									>
										{isFreePlan ? 'Current Plan' : 'Subscribe'}
									</AppButton>
								</Stripe>
							</td>
							<td>
								<Stripe
									name="Appbase.io Bootstrap Plan"
									amount={this.plans.bootstrap.basePrice * 100}
									token={token => this.handleToken(token, 'bootstrap-monthly')}
									stripeKey={this.stripeKey}
									disabled={isBootstrapPlan}
									desktopShowModal={selectedPlan === 'bootstrap'}
								>
									<AppButton
										uppercase
										big
										bold
										shadow
										color="#FFFFFF"
										backgroundColor={theme.badge.blue}
										css={{ marginTop: 40 }}
										onClick={isBootstrapPlan ? this.showConfirmBox : undefined}
									>
										{isBootstrapPlan ? 'Unsubscribe' : 'Subscribe'}
									</AppButton>
								</Stripe>
							</td>
							<td>
								<Stripe
									name="Appbase.io Growth Plan"
									disabled={isGrowthPlan}
									amount={this.plans.growth.basePrice * 100}
									token={token => this.handleToken(token, 'growth-monthly')}
									stripeKey={this.stripeKey}
									desktopShowModal={selectedPlan === 'growth'}
								>
									<AppButton
										uppercase
										big
										bold
										shadow
										color="#FFFFFF"
										backgroundColor={theme.badge.darkBlue}
										onClick={isGrowthPlan ? this.showConfirmBox : undefined}
										css={{ marginTop: 40 }}
									>
										{isGrowthPlan ? 'Unsubscribe' : 'Subscribe'}
									</AppButton>
								</Stripe>
							</td>
						</tr>
					</tfoot>
				</Table>
				<div
					className={showOnLarge}
					css={{
						display: 'flex',
						flexWrap: 'wrap',
						justifyContent: 'center',
						maxWidth: '95%',
						marginRight: 'auto',
						marginLeft: 'auto',
					}}
				>
					<NewPricingCard
						css={{ color: theme.colors.accentText }}
						name="Free"
						isCurrentPlan={isFreePlan}
						buttonText={isFreePlan ? 'Current Plan' : undefined}
						price="$0"
						stripeName="Appbase.io Free Plan"
						amount={0}
						token={token => this.handleToken(token, 'free')}
						stripeKey={this.stripeKey}
						pricingList={['10K Records', '100K API Calls']}
					>
						<CheckList list={['Weekly analytics e-mail', 'Community support']} />
					</NewPricingCard>
					<NewPricingCard
						css={{ backgroundColor: theme.badge.blue }}
						name="Bootstrap"
						isCurrentPlan={isBootstrapPlan}
						price={`$${this.plans.bootstrap.basePrice}`}
						stripeName="Appbase.io Bootstrap Plan"
						amount={this.plans.bootstrap.basePrice * 100}
						token={token => this.handleToken(token, 'bootstrap-monthly')}
						stripeKey={this.stripeKey}
						linkColor="inherit"
						pricingList={['50K Records', '1M API Calls']}
						buttonText={isBootstrapPlan ? 'Unsubscribe' : undefined}
						onClickButton={isBootstrapPlan ? this.showConfirmBox : undefined}
					>
						<ListCaption>Features</ListCaption>
						<CheckList
							list={[
								'Team access',
								'ACLs & enhanced security',
								'Editable mappings',
								'1 Search Sandbox profile',
								'7-days analytics retention',
							]}
						/>
						<ListCaption>Support and Guidance</ListCaption>
						<CheckList
							list={[
								'Email support',
								'Basic tooling support',
								'Premium support can be added',
							]}
						/>
					</NewPricingCard>
					<NewPricingCard
						css={{ backgroundColor: theme.badge.darkBlue }}
						name="Growth"
						isCurrentPlan={isGrowthPlan}
						price={`$${this.plans.growth.basePrice}`}
						stripeName="Appbase.io Growth Plan"
						amount={this.plans.growth.basePrice * 100}
						token={token => this.handleToken(token, 'growth-monthly')}
						stripeKey={this.stripeKey}
						linkColor="inherit"
						pricingList={['1M Records', '10M API Calls']}
						buttonText={isGrowthPlan ? 'Unsubscribe' : undefined}
						onClickButton={isGrowthPlan ? this.showConfirmBox : undefined}
					>
						<ListCaption>Features</ListCaption>
						<CheckList
							list={[
								'Team access',
								'ACLs & enhanced security',
								'Editable mappings',
								'3 Search Sandbox profiles',
								'30-days analytics retention',
								'Accounts & Analytics API access',
							]}
						/>
						<ListCaption>Support and Guidance</ListCaption>
						<CheckList
							list={[
								'Email support',
								'Priority tooling support',
								'Premium support can be added',
							]}
						/>
					</NewPricingCard>
				</div>
			</React.Fragment>
		);
	}
}

PricingTable.propTypes = {
	createSubscription: PropTypes.func.isRequired,
	deleteSubscription: PropTypes.func.isRequired,
	fetchAppPlan: PropTypes.func.isRequired,
	isLoading: PropTypes.bool.isRequired,
	isSubmitting: PropTypes.bool.isRequired,
	isFreePlan: PropTypes.bool.isRequired,
	isBootstrapPlan: PropTypes.bool.isRequired,
	isGrowthPlan: PropTypes.bool.isRequired,
	errors: PropTypes.array.isRequired,
};
const mapStateToProps = (state) => {
	const appPlan = getAppPlanByName(state);
	return {
		isSubmitting: get(state, '$deleteAppSubscription.isFetching'),
		isLoading: get(state, '$createAppSubscription.isFetching'),
		isFreePlan: !get(appPlan, 'isPaid'),
		isBootstrapPlan: get(appPlan, 'isBootstrap'),
		isGrowthPlan: get(appPlan, 'isGrowth'),
		errors: [
			get(state, '$deleteAppSubscription.error'),
		],
	};
};

const mapDispatchToProps = dispatch => ({
	createSubscription: (plan, stripeToken) => dispatch(createAppSubscription(plan, stripeToken)),
	deleteSubscription: appName => dispatch(deleteAppSubscription(appName)),
	fetchAppPlan: () => dispatch(getAppPlan()),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(PricingTable);
