import React, { Component } from 'react';
import styled, { css } from 'react-emotion';
import { Check } from 'react-feather';
import ReactToolTip from 'react-tooltip';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import AppButton from './AppButton';
import PlusMinus from './PlusMinus';
import NewPricingCard from './NewPricingCard';
import theme from './theme';
import { media, hexToRgb } from './utils';

const CheckList = ({ list }) =>
	list.map(item => (
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
`;

const showOnLarge = css`
	display: none;
	${media.ipadPro(css`
		display: flex;
	`)};
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
		font-weight: 600;
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
		min-width: 205px;
		max-width: 237px;
		border: 1.5px solid #f4f4f4;
		border-bottom: 0;
		padding: 11px 2px;
		font-size: 18px;
		font-weight: 600;
		line-height: 22px;
		text-align: center;

		&:nth-child(1) {
			min-width: 240px;
			border-color: transparent;
			text-align: left;
			font-size: 20px;
			font-weight: 600;
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
	font-weight: 600;
	line-height: 17px;
	text-align: center;
	text-decoration: none !important;
`;

const ListCaption = styled('div')`
	margin-top: 13px;
	color: ${hexToRgb('#FFFFFF', 0.8)};
	font-size: 0.875rem;
	font-weight: 600;
	line-height: 17px;
	text-align: left;
	text-decoration: none !important;
	text-transform: uppercase;
	margin-left: 3px;
`;

const HeadingTr = css`
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
		padding-bottom: 0 !important;
		padding-top: 20px !important;
		> small {
			display: block;
			clear: both;
			color: #232e44;
			font-size: 12px;
			line-height: 17px;
			text-transform: none;
			font-weight: 600;
			a {
				color: inherit;
			}
		}
	}
`;

export default class PricingTable extends Component {
	constructor(props) {
		super(props);

		const bootstrap = {
			records: [],
			apiCalls: [],
			basePrice: 29,
		};

		const growth = {
			records: [],
			apiCalls: [],
			basePrice: 89,
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
			plans: this.plans,
		};
	}

	calcPrice(planName) {
		const { basePrice } = this.state.plans[planName];

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
		const { plans, bootstrap, growth } = this.state;
		const { onClickButton } = this.props;
		return (
			<React.Fragment>
				<Table className={hideOnLarge}>
					<thead>
						<tr colSpan="1">
							<td>
								<ReactToolTip place="right" effect="solid" multiline />
							</td>
							<td>
								<Title>FREE</Title>
								<Price>
									$0<br />
									<small>/month</small>
								</Price>
								<Caption>
									<a href="/static/poweredby_logo_placement.zip">
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
							<td />
							<td />
						</tr>
						<tr>
							<td>
								<span data-tip="A record (aka document) holds one object<br/> stored as a JSON into the database.">
									Records
								</span>
							</td>
							<td>10K</td>
							<td>
								<PlusMinus
									values={plans.bootstrap.records}
									onChange={(value, index) => {
										this.setState({
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
								<span data-tip="One API call is a read, write, update, <br/> search or a streaming response.">
									API Calls
								</span>
							</td>
							<td>100K</td>
							<td>
								<PlusMinus
									values={plans.bootstrap.apiCalls}
									onChange={(value, index) => {
										this.setState({
											bootstrap: Object.assign(bootstrap, { apiCall: index }),
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
								<span data-tip="Invite team members and collaborate <br/> together on your app.">
									Team Access
								</span>
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
								<span data-tip="Set fine-grained access control policies per API key. <br/>Secure using HTTP Referers, IP sources and more.">
									<AnchorLink href="#addons">ACLs & Security</AnchorLink>
								</span>
							</td>
							<td>-</td>
							<td>Basic</td>
							<td>Included</td>
						</tr>
						<tr>
							<td>
								<span data-tip="Edit your app schema on the fly <br/> without worrying about data loss.">
									<AnchorLink href="#addons">Editable Mappings</AnchorLink>
								</span>
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
								<span data-tip="Test-drive and tune your search relevancy<br/> without breaking a sweat.">
									<AnchorLink href="#addons">Search Sandbox</AnchorLink>
								</span>
							</td>
							<td>Basic</td>
							<td>1 Profile</td>
							<td>3 Profiles</td>
						</tr>
						<tr>
							<td>
								<span data-tip="Get actionable analytics on popular searches,<br/> no result searches and clicks and conversions.">
									Analytics
								</span>
							</td>
							<td>-</td>
							<td>7 days Retention</td>
							<td>30 days Retention</td>
						</tr>
						<tr>
							<td>
								<span data-tip="Create app, API keys, edit mappings <br/> and get analytics and insights via API.">
									Accounts API
								</span>
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
									<AnchorLink href="#support">
										Get premium support and business SLAs
									</AnchorLink>
								</small>
							</td>
							<td />
							<td />
							<td />
						</tr>
						<tr>
							<td>
								<span data-tip="Support on core platform features.">
									Platform Support
								</span>
							</td>
							<td>Community</td>
							<td>Email</td>
							<td>Email</td>
						</tr>
						<tr>
							<td>
								<span data-tip="Support on non-core libraries, tools <br/> and open-source projects.">
									<AnchorLink href="#support">Tools Support</AnchorLink>
								</span>
							</td>
							<td>Community</td>
							<td>Basic</td>
							<td>Priority</td>
						</tr>
						<tr>
							<td>
								<span data-tip="One time support on getting started, <br/> migrations and setup.">
									<AnchorLink href="#support">Onboarding Support</AnchorLink>
								</span>
							</td>
							<td>-</td>
							<td>Can be added</td>
							<td>Can be added</td>
						</tr>
						<tr>
							<td>
								<span data-tip="1:1 reviews with an engineer on data modeling, <br/> best practices and scaling.">
									<AnchorLink href="#support">Architecture Reviews</AnchorLink>
								</span>
							</td>
							<td>-</td>
							<td>Can be added</td>
							<td>Can be added</td>
						</tr>
						<tr>
							<td>
								<span data-tip="Get dedicated onsite support with 1-day SLAs.">
									<AnchorLink href="#support">Premium Support</AnchorLink>
								</span>
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
								<AppButton
									uppercase
									big
									bold
									shadow
									color={theme.colors.accentText}
									backgroundColor={theme.colors.accent}
									css={{ marginTop: 40 }}
									onClick={() => onClickButton('free', 0)}
								>
									Subscribe
								</AppButton>
							</td>
							<td>
								<AppButton
									uppercase
									big
									bold
									shadow
									color="#FFFFFF"
									backgroundColor={theme.badge.blue}
									css={{ marginTop: 40 }}
									onClick={() => onClickButton('bootstrap', 29)}
								>
									Subscribe
								</AppButton>
							</td>
							<td>
								<AppButton
									uppercase
									big
									bold
									shadow
									color="#FFFFFF"
									backgroundColor={theme.badge.darkBlue}
									css={{ marginTop: 40 }}
									onClick={() => onClickButton('growth', 89)}
								>
									Subscribe
								</AppButton>
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
						price="$0"
						onClickLink={() => onClickButton('free', 0)}
						pricingList={['10K Records', '100K API Calls']}
					>
						<CheckList list={['Weekly analytics e-mail', 'Community support']} />
					</NewPricingCard>
					<NewPricingCard
						css={{ backgroundColor: theme.badge.blue }}
						name="Bootstrap"
						price="$29"
						onClickLink={() => onClickButton('bootstrap', 29)}
						linkColor="inherit"
						pricingList={['50K Records', '1M API Calls']}
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
						price="$99"
						onClickLink={() => onClickButton('growth', 89)}
						linkColor="inherit"
						pricingList={['1M Records', '10M API Calls']}
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
