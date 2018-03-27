import React, { Component } from 'react';
import PhoneInput from 'react-intl-tel-input';
import 'react-intl-tel-input/dist/main.css';

import { appbaseService } from '../service/AppbaseService';
import countryCodes from './utils/countryCodes';

class UserInfo extends Component {
    state = {
        name: '',
        company: '',
        deploymentTimeframe: '',
        phone: '',
        countryCode: '',
        submitCountryCode: '',
        useCase: ''
    }

    componentWillMount() {
        appbaseService.getUser()
            .then(({ userInfo: { body } }) => {
                this.setState({
                    company: body.company,
                    deploymentTimeframe: body['deployment-timeframe'],
                    phone: body.phone.length ? body.phone.split('-')[1] : '',
                    countryCode: body.phone.length
                        ? countryCodes.find(item => item.dial_code === body.phone.split('-')[0]).code
                        : '',
                    useCase: body.usecase,
                    name: body.details.name.split(' ')[0]
                });
            })
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phone' && !/^\d*$/.test(value)) {
            return;
        }
        this.setState({
            [name]: value
        });
    }

    handleSubmit = () => {
        const { company, deploymentTimeframe, phone, submitCountryCode, useCase } = this.state;
        appbaseService
            .setUserInfo({
                company,
                'deployment-timeframe': deploymentTimeframe,
                phone: `${submitCountryCode}-${phone}`,
                usecase: useCase
            })
            .then(() => {
                appbaseService
                    .getUser()
                    .then(() => {
                        this.props.forceUpdate()
                    });
            });
    }
    
    render() {
        const { company, deploymentTimeframe, useCase, phone, countryCode, name } = this.state;
        const deploymentOptions = [
            'Within the next week',
            'Within the next several weeks',
            'Evaluating',
            'Hobby project'
        ];
        const useCaseOptions = [
            'Backend',
            'Web',
            'React Native (iOS, Android)',
            'Not sure'
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
                        <div className="field-title">How soon do you wish to deploy to production? *</div>
                        <div className="dropdown">
                            <button className="dropdown-toggle" type="button" id="deployment-menu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                {deploymentTimeframe.length ? deploymentTimeframe : 'Select'}&nbsp;&nbsp;<span className="caret" />
                            </button>
                            <ul className="ad-dropdown-menu dropdown-menu" aria-labelledby="sortby-menu">
                                {
                                    deploymentOptions.map((item) => (
                                        <li key={item}>
                                            <a onClick={() => this.handleChange({
                                                target: {
                                                    name: 'deploymentTimeframe',
                                                    value: item
                                                }
                                            })}>
                                                {item}
                                            </a>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                    <div className="field">
                        <div className="field-title">What is the primary use-case you are looking at? *</div>
                        <div className="dropdown">
                            <button className="dropdown-toggle" type="button" id="usecase-menu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                {useCase.length ? useCase : 'Select'}&nbsp;&nbsp;<span className="caret" />
                            </button>
                            <ul className="ad-dropdown-menu dropdown-menu" aria-labelledby="sortby-menu">
                                {
                                    useCaseOptions.map((item) => (
                                        <li key={item}>
                                            <a onClick={() => this.handleChange({
                                                target: {
                                                    name: 'useCase',
                                                    value: item
                                                }
                                            })}>
                                                {item}
                                            </a>
                                        </li>
                                    ))
                                }
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
                                    submitCountryCode: dialCode
                                });
                            }}
                            onPhoneNumberChange={(status, value, { dialCode }) => {
                                this.handleChange({
                                    target: {
                                        name: 'phone',
                                        value
                                    }
                                });
                                this.setState({
                                    submitCountryCode: dialCode
                                });
                            }}
                        />
                        {
                            phone.length > 11
                            && <div className="alert-text">Phone No. max characters exceeded</div>
                        }
                    </div>
                    <div className="field">
                        <div className="field-title">Company Name</div>
                        <input name="company" value={company} onChange={this.handleChange} />
                    </div>
                    <button
                        disabled={!(deploymentTimeframe.length && phone.length <= 15 && useCase.length)}
                        className="btn theme-btn ad-theme-btn primary"
                        onClick={this.handleSubmit}
                    >
                        Submit
                    </button>
                </div>
            </section>
        );
    }
}

UserInfo.defaultProps = {
    description: "This is your profile view",
    forceUpdate: () => { appbaseService.pushUrl('/apps') }
}

export default UserInfo;
