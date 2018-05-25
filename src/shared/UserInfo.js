import React, { Component } from 'react';
import PhoneInput from 'react-intl-tel-input';
import 'react-intl-tel-input/dist/main.css';

import { appbaseService } from '../service/AppbaseService';
import { intercomService } from './helper';
import countryCodes from './utils/countryCodes';

class UserInfo extends Component {
	state = {
		name: '',
		company: '',
		deploymentTimeframe: '',
		phone: '',
		countryCode: '',
		submitCountryCode: '',
		useCase: '',
		optIn: false,
		loading: false,
		success: false,
	};

	componentWillMount() {
		appbaseService.getUser().then(({ userInfo: { body } }) => {
			this.setState({
				company: body.company,
				deploymentTimeframe: body['deployment-timeframe'],
				phone: body.phone.length ? body.phone.split('-')[1] : '',
				countryCode: body.phone.length
					? countryCodes.find(item => item.dial_code === body.phone.split('-')[0]).code
					: '',
				useCase: body.usecase,
				name: body.details.name.split(' ')[0],
				optIn: localStorage.getItem('optIn') === 'true',
			});
		});
	}

	handleChange = (e) => {
		const { name, value } = e.target;
		if (name === 'phone' && !/^\d*$/.test(value)) {
			return;
		}
		this.setState({
			[name]: value,
		});
	};

	handleSubmit = () => {
		this.setState({
			loading: true,
		});
		const {
			company,
			deploymentTimeframe,
			phone,
			submitCountryCode,
			useCase,
			optIn,
		} = this.state;
		appbaseService
			.setUserInfo({
				company,
				'deployment-timeframe': deploymentTimeframe,
				phone: `${submitCountryCode}-${phone}`,
				usecase: useCase,
			})
			.then(() => {
				appbaseService.getUser().then(({ userInfo: { body } }) => {
					const intercomPayload = {
						name: body.details.name,
						'deployment-timeframe': deploymentTimeframe,
						usecase: useCase,
						optInMail: optIn,
					};
					if (company.length) {
						intercomPayload.companies = [
							{
								company_id: company,
								name: company,
							},
						];
					}
					if (phone.length) {
						intercomPayload.phone = `+${submitCountryCode}${phone}`;
					}
					intercomService.update(intercomPayload);
					this.setState({
						loading: false,
						success: true,
					});
					setTimeout(this.props.forceUpdate, 1000);
				});
			});
	};

	render() {
		const {
 company, deploymentTimeframe, useCase, phone, name,
} = this.state;
		let { countryCode } = this.state;
		if (countryCode === 'CA') {
			countryCode = 'US';
		}
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
		return (
			<section className="user-info-list">
				<div className="user-info-header">
					<div className="container">
						<h1 className="title">Hi {name},</h1>
						<p className="sub-title">{this.props.description}</p>
					</div>
				</div>
				<div className="user-info-form container">
					<div className="field">
						<div className="field-title">* What are you building?</div>
						<div className="dropdown">
							<button
								className="dropdown-toggle"
								type="button"
								id="usecase-menu"
								data-toggle="dropdown"
								aria-haspopup="true"
								aria-expanded="true"
							>
								{useCase.length ? useCase : 'Select'}&nbsp;&nbsp;<span className="caret" />
							</button>
							<ul
								className="ad-dropdown-menu dropdown-menu"
								aria-labelledby="sortby-menu"
							>
								{useCaseOptions.map(item => (
									<li key={item}>
										<a
											onClick={() =>
												this.handleChange({
													target: {
														name: 'useCase',
														value: item,
													},
												})
											}
										>
											{item}
										</a>
									</li>
								))}
							</ul>
						</div>
					</div>
					<div className="field">
						<div className="field-title">
							* How soon do you plan to go to production?
						</div>
						<div className="dropdown">
							<button
								className="dropdown-toggle"
								type="button"
								id="deployment-menu"
								data-toggle="dropdown"
								aria-haspopup="true"
								aria-expanded="true"
							>
								{deploymentTimeframe.length ? deploymentTimeframe : 'Select'}&nbsp;&nbsp;<span className="caret" />
							</button>
							<ul
								className="ad-dropdown-menu dropdown-menu"
								aria-labelledby="sortby-menu"
							>
								{deploymentOptions.map(item => (
									<li key={item}>
										<a
											onClick={() =>
												this.handleChange({
													target: {
														name: 'deploymentTimeframe',
														value: item,
													},
												})
											}
										>
											{item}
										</a>
									</li>
								))}
							</ul>
						</div>
					</div>
					<div className="field" key={countryCode}>
						<div className="field-title">Phone Number</div>
						<PhoneInput
							value={phone}
							preferredCountries={['us', 'in']}
							defaultCountry={countryCode.toLowerCase()}
							onSelectFlag={(value, { dialCode }) => {
								this.setState({
									submitCountryCode: dialCode,
								});
							}}
							onPhoneNumberChange={(status, value, { dialCode }) => {
								this.handleChange({
									target: {
										name: 'phone',
										value,
									},
								});
								this.setState({
									submitCountryCode: dialCode,
								});
							}}
						/>
						{phone.length > 11 && (
							<div className="alert-text">Phone No. max characters exceeded</div>
						)}
					</div>
					<div className="field">
						<div className="field-title">Company Name</div>
						<input name="company" value={company} onChange={this.handleChange} />
					</div>
					<button
						disabled={
							!(deploymentTimeframe.length && phone.length <= 15 && useCase.length)
						}
						className="btn theme-btn ad-theme-btn primary"
						onClick={this.handleSubmit}
					>
						{this.state.loading ? 'Submitting...' : 'Submit'}
					</button>
					{this.state.success && (
						<span style={{ margin: 15, color: '#759352' }}>
							Profile updated successfully
						</span>
					)}
				</div>
			</section>
		);
	}
}

UserInfo.defaultProps = {
	description: 'This is your profile view.',
	forceUpdate: () => {
		appbaseService.pushUrl('/apps');
	},
};

export default UserInfo;
