import React from 'react';
import {
 Input, Select, Icon, notification, Button, Card, Avatar, Popover,
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
import Flex from '../../batteries/components/shared/Flex';
import countryCodes from '../../utils/countryCodes';
import { displayErrors } from '../../batteries/utils/heplers';

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
	'An e-commerce store',
	'An IoT app',
	'Not sure yet',
];
const { Option } = Select;

class ProfilePage extends React.Component {
	constructor(props) {
		super(props);
		const defaultUseCase = props.isShopify ? useCaseOptions[2] : undefined;
		this.profileForm = FormBuilder.group({
			usecase: [defaultUseCase, Validators.required],
			deploymentTimeframe: [undefined, Validators.required],
			phone: [undefined, [Validators.maxLength(10)]],
			name: ['', Validators.required],
			company: undefined,
			picture: '',
		});
		this.state = {
			submitCountryCode: props.countryCode,
			currentPicture: '',
		};
	}

	componentDidMount() {
		const {
			usecase, deploymentTimeframe, phone, company, username, picture, isShopify,
		} = this.props; // prettier-ignore

		const defaultUseCase = isShopify ? useCaseOptions[2] : usecase;

		this.profileForm.patchValue({
			usecase: usecase || defaultUseCase,
			deploymentTimeframe,
			phone,
			company,
			name: username,
			picture,
		});

		this.updatePicture(picture);

		this.profileForm.get('picture').valueChanges.subscribe((value) => {
			this.updatePicture(value);
		});
	}

	componentDidUpdate(prevProps) {
		const {
			isSuccess, errors, handleCallback,
		} = this.props; // prettier-ignore
		if (isSuccess && isSuccess !== prevProps.isSuccess) {
			notification.success({
				message: 'Updated user successfully!',
			});
			if (handleCallback) {
				handleCallback();
			}
		}
		displayErrors(errors, prevProps.errors);
	}

	updatePicture = (currentPicture) => {
		this.setState({ currentPicture });
	};

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
		const { submitCountryCode, currentPicture } = this.state;
		const { isSubmitting, title } = this.props;
		const { name } = this.profileForm.value;

		const avatar = {};

		if (currentPicture) {
			avatar.src = currentPicture;
		} else if (name) {
			avatar.style = {
				backgroundColor: '#1890ff',
			};
		} else {
			avatar.icon = 'user';
		}
		return (
			<FieldGroup control={this.profileForm} strict={false}>
				{({ invalid, pristine }) => (
					<Card
						title={title || 'Account Details'}
						css={{
							'.ant-card-head-wrapper': {
								alignItems: 'center',
							},
							minWidth: '420px',
						}}
					>
						<p>About You</p>
						<FieldControl
							name="name"
							render={({ handler }) => (
								<div css={fieldWrapper}>
									<span
										style={{
											display: 'block',
										}}
									>
										* Name
									</span>
									<Input
										style={{
											marginTop: '7px',
											display: 'inline',
											width: '70%',
										}}
										placeholder="First and Last Name"
										{...handler()}
									/>
									<Popover
										placement="bottom"
										content={(
<FieldControl
												name="picture"
												render={({ handler }) => (
													<div css={fieldWrapper}>
														<span>Profile Picture</span>
														<Input
															style={{
																marginTop: '7px',
															}}
															placeholder="Update by adding an image URL"
															{...handler()}
														/>
													</div>
												)}
/>
)}
									>
										<Avatar
											{...avatar}
											size={50}
											css={{
												cursor: 'pointer',
												marginLeft: '1rem',
												marginTop: '-0.4rem',
											}}
										>
											{avatar.style ? name.charAt(0).toLocaleUpperCase() : ''}
										</Avatar>
									</Popover>
								</div>
							)}
						/>
						<FieldControl
							strict={false}
							name="phone"
							render={({ handler }) => {
								const inputHandler = handler();
								return (
									<div css={fieldWrapper}>
										<span>Phone Number</span>
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
											onPhoneNumberChange={(status, value, { dialCode }) => {
												if (/^(\d){0,10}$/.test(value)) {
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
									<span>Company Name</span>
									<Input
										style={{
											marginTop: '7px',
										}}
										placeholder="Company"
										{...handler()}
									/>
								</div>
							)}
						/>
						<p
							style={{
								paddingTop: '1rem',
							}}
						>
							Your Project
						</p>
						<FieldControl
							name="usecase"
							render={({ handler }) => {
								const inputHandler = handler();
								return (
									<div css={fieldWrapper}>
										<span>* What project are you building search for?</span>
										<Select
											style={{
												marginTop: '7px',
												display: 'block',
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
										<span>* How soon do you plan to go to production?</span>
										<Select
											style={{
												marginTop: '7px',
												display: 'block',
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
						<Flex justifyContent="left" alignItems="center">
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
					</Card>
				)}
			</FieldGroup>
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
		picture: get(state, 'user.data.picture'),
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
