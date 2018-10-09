import React from 'react';
import {
 Input, Select, Icon, notification, Button,
} from 'antd';
import get from 'lodash/get';
import { css } from 'react-emotion';
import { connect } from 'react-redux';
import PhoneInput from 'react-intl-tel-input';
import 'react-intl-tel-input/dist/main.css';
import {
 FormBuilder, FieldGroup, FieldControl, Validators,
} from 'react-reactive-form';
import { updateUser } from '../../batteries/modules/actions';
import Container from '../../components/Container';
import FullHeader from '../../components/FullHeader';
import Flex from '../../batteries/components/shared/Flex';
import Banner from '../../components/Banner/Header';
import countryCodes from '../../utils/countryCodes';
import { displayErrors } from '../../batteries/utils/heplers';

const formCls = css`
	margin: auto;
	max-width: 300px;
`;
const fieldTitle = css``;
const fieldWrapper = css`
	margin-bottom: 20px;
	input {
		position: inherit;
		font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
			'Noto Sans', 'Ubuntu', 'Droid Sans', 'Helvetica Neue', sans-serif;
		font-variant: tabular-nums;
		box-sizing: border-box;
		margin: 0;
		padding: 0;
		list-style: none;
		margin-top: 7px;
		position: relative;
		display: inline-block;
		padding: 4px 11px;
		width: 100%;
		height: 32px;
		font-size: 14px;
		line-height: 1.5;
		color: rgba(0, 0, 0, 0.65);
		background-color: #fff;
		background-image: none;
		border: 1px solid #d9d9d9;
		border-radius: 4px;
		transition: all 0.3s;
	}
`;
const deploymentOptions = [
	'Within the next week',
	'Within the next several weeks',
	'I am currently evaluating',
	'This is a hobby project',
];
const useCaseOptions = [
	'A web app',
	'A mobile app (iOS, Android, React Native)',
	'A backend system',
	'An IoT app',
	'Not sure yet',
];
const { Option } = Select;

class ProfilePage extends React.Component {
	constructor(props) {
		super(props);
		this.profileForm = FormBuilder.group({
			usecase: [undefined, Validators.required],
			deploymentTimeframe: [undefined, Validators.required],
			phone: [undefined, [Validators.maxLength(10)]],
			company: undefined,
		});
		this.state = {
			submitCountryCode: props.countryCode,
		};
	}

	componentDidMount() {
		const {
 usecase, deploymentTimeframe, phone, company,
} = this.props;
		this.profileForm.patchValue({
			usecase,
			deploymentTimeframe,
			phone,
			company,
		});
	}

	componentDidUpdate(prevProps) {
		const { isSuccess, errors } = this.props;
		if (isSuccess && isSuccess !== prevProps.isSuccess) {
			notification.success({
				message: 'Updated user successfully!',
			});
		}
		displayErrors(errors, prevProps.errors);
	}

	handleSubmit = () => {
		const { setUser } = this.props;
		const { submitCountryCode } = this.state;
		setUser({
			...this.profileForm.value,
			'deployment-timeframe': this.profileForm.value.deploymentTimeframe,
			phone: `${submitCountryCode}-${this.profileForm.value.phone}`,
		});
	};

	render() {
		const { submitCountryCode } = this.state;
		const { isSubmitting, username } = this.props;
		const firstName = username ? username.split(' ')[0] : 'Bud';
		return (
			<React.Fragment>
				<FullHeader />
				<Banner title={`Hi ${firstName},`} description="This is your profile view." />
				<Container>
					<FieldGroup control={this.profileForm} strict={false}>
						{({ invalid, pristine }) => (
							<div css={formCls}>
								<FieldControl
									name="usecase"
									render={({ handler }) => {
										const inputHandler = handler();
										return (
											<div css={fieldWrapper}>
												<span css={fieldTitle}>
													* What are you building?
												</span>
												<Select
													style={{
														width: '100%',
														marginTop: '7px',
													}}
													{...inputHandler}
													value={inputHandler.value || undefined}
													placeholder="Select"
												>
													{useCaseOptions.map(i => (
														<Option key={i} value={i}>
															{i}
														</Option>
													))}
												</Select>
											</div>
										);
									}}
								/>
								<FieldControl
									name="deploymentTimeframe"
									render={({ handler }) => {
										const inputHandler = handler();
										return (
											<div css={fieldWrapper}>
												<span css={fieldTitle}>
													* How soon do you plan to go to production?
												</span>
												<Select
													style={{
														width: '100%',
														marginTop: '7px',
													}}
													{...inputHandler}
													value={inputHandler.value || undefined}
													placeholder="Select"
												>
													{deploymentOptions.map(i => (
														<Option key={i} value={i}>
															{i}
														</Option>
													))}
												</Select>
											</div>
										);
									}}
								/>
								<FieldControl
									strict={false}
									name="phone"
									render={({ handler }) => {
										const inputHandler = handler();
										return (
											<div css={fieldWrapper}>
												<span css={fieldTitle}>Phone Number</span>
												<PhoneInput
													style={{
														width: '100%',
														marginTop: '7px',
													}}
													{...handler()}
													preferredCountries={['us', 'in']}
													// /
													defaultCountry={submitCountryCode.toLowerCase()}
													onSelectFlag={(value, { dialCode }) => {
														this.setState({
															submitCountryCode: dialCode,
														});
													}}
													onPhoneNumberChange={(
														status,
														value,
														{ dialCode },
													) => {
														if (/^\d*$/.test(value)) {
															inputHandler.onChange(value);
														}
														this.setState({
															submitCountryCode: dialCode,
														});
													}}
												/>
											</div>
										);
									}}
								/>
								<FieldControl
									name="company"
									render={({ handler }) => (
										<div css={fieldWrapper}>
											<span css={fieldTitle}>Company Name</span>
											<Input
												style={{
													marginTop: '7px',
												}}
												placeholder="Username"
												{...handler()}
											/>
										</div>
									)}
								/>
								<Flex justifyContent="center" alignItems="center">
									<Button
										type="primary"
										onClick={this.handleSubmit}
										disabled={invalid || pristine}
									>
										{isSubmitting && (
											<Icon
												type="loading"
												style={{
													marginRight: '10px',
												}}
											/>
										)}
										Submit
									</Button>
								</Flex>
							</div>
						)}
					</FieldGroup>
				</Container>
			</React.Fragment>
		);
	}
}
const mapStateToProps = (state) => {
	const phoneInfo = get(state, 'user.data.phone');
	return {
		isSubmitting: get(state, '$updateUser.isFetching'),
		errors: [get(state, '$updateUser.error')],
		isSuccess: get(state, '$updateUser.success'),
		usecase: get(state, 'user.data.usecase'),
		deploymentTimeframe: get(state, 'user.data.deployment-timeframe'),
		phone: get(phoneInfo, 'length') ? phoneInfo.split('-')[1] : '',
		company: get(state, 'user.data.company'),
		username: get(state, 'user.data.name'),
		countryCode: get(phoneInfo, 'length')
			? get(countryCodes.find(item => item.dial_code === phoneInfo.split('-')[0]), 'code', '')
			: '',
	};
};
const mapDispatchToProps = dispatch => ({
	setUser: info => dispatch(updateUser(info)),
});
export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ProfilePage);
