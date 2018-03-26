import React, { Component } from 'react';

import { appbaseService } from '../service/AppbaseService';

class UserInfo extends Component {
    state = {
        name: '',
        company: '',
        deploymentTimeframe: '',
        phone: '',
        useCase: ''
    }

    componentWillMount() {
        appbaseService.getUser()
            .then(({ userInfo: { body } }) => {
                this.setState({
                    company: body.company,
                    deploymentTimeframe: body['deployment-timeframe'],
                    phone: body.phone,
                    useCase: body.usecase,
                    name: body.details.name.split(' ')[0]
                });
            })
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }

    handleSubmit = () => {
        const { company, deploymentTimeframe, phone, useCase } = this.state;
        appbaseService
            .setUserInfo({
                company,
                'deployment-timeframe': deploymentTimeframe,
                phone,
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
        const { company, deploymentTimeframe, useCase, phone, name } = this.state;
        const deploymentOptions = [
            'Within the next week',
            'Within the next several weeks',
            'Evaluating',
            'Hobby project'
        ];
        return (
            <section className="user-info-list">
                <div className="user-info-header">
                    <div className="container">
                        <h1 className="title">Hi {name},</h1>
                        <p className="sub-title">Please answer a few questions before you get started</p>
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
                        <input name="useCase" value={useCase} onChange={this.handleChange} />
                    </div>
                    <div className="field">
                        <div className="field-title">Phone Number</div>
                        <input name="phone" value={phone} onChange={this.handleChange} />
                        {
                            phone.length > 15
                            && <div className="alert-text">Phone No. should be max 15 characters</div>
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
    forceUpdate: () => { appbaseService.pushUrl('/apps') }
}

export default UserInfo;
