import React, { Component } from 'react';
import { Link } from 'react-router';
import { appbaseService } from '../../../service/AppbaseService';
import { Loading } from "../../../shared/SharedComponents";
import { common } from "../../../shared/helper";
import AppCard from './AppCard';

const $ = require('jquery');

export default class NewApp extends Component {

	constructor(props) {
		super(props);
		this.state = {
			value: '',
			height: '100px',
			validate: {
				value: true,
				error: null
			},
			showInput: false
		};
		this.errors = {
			'duplicate': 'Duplicate app',
			'required': 'Appname is required!'
		};
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {
		// var appCard = $('.apps .app-card-container');
		// var height = $(appCard[appCard.length-1]).height();
		// this.setState({
		// 	height: height+'px'
		// });
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.createAppError && nextProps.createAppError.Message) {
			if (nextProps.createAppError.Message.indexOf('duplicate') > -1) {
				this.createAppError = this.errors['duplicate'];
			} else {
				this.createAppError = nextProps.createAppError;
			}
		} else if (nextProps.clearInput) {
			this.setState({
				value: ''
			});
		}
	}

	validateApp(appName) {
		let validate = {
			value: true,
			error: null
		};
		this.createAppError = null;
		appName = appName.trim();
		if (!appName) {
			validate.value = false;
			// validate.error = this.errors['required'];
		} else {
			// let duplicateApp = this.props.apps.filter((app) => appName === app.appname);
			// if (duplicateApp && duplicateApp.length) {
			// 	validate.value = false;
			// 	validate.error = this.errors['duplicate'];
			// }
		}
		return validate;
	}

	handleChange(event) {
		let appName = event.target.value;
		this.setState({
			value: appName,
			validate: this.validateApp(appName)
		});
	}

	renderElement(ele) {
		let generatedEle = null;
		switch (ele) {
			case 'helpBlock':
				if (this.state.validate.error || this.createAppError) {
					generatedEle = (
						<div className="alert alert-warning" role="alert">
							{this.state.validate.error || this.createAppError}
						</div>
					);
				}
				break;
		}
		return generatedEle;
	}

	handleSubmit() {
		if(this.state.value.trim()) {
			this.props.createApp(this.state.value);
		} else {
			$(this.inputboxRef).trigger('focus');
		}
	}

	showInput() {
		this.setState({
			showInput: true
		});
	}

	render() {
		return (
			<AppCard setClassName="appcard-newapp">
					<div className="ad-list-newapp">
						{
							this.state.showInput ? (
								<div className="col-xs-12 p-0">
									<div className={"col-xs-12 p-0 form-group "+ (this.state.validate.error ? 'has-error' : '')}>
										<input ref={(input) => this.inputboxRef = input} type="text" placeholder="Enter an app name (no spaces)" value={this.state.value} className="form-control" onChange={this.handleChange} />
										{this.renderElement('helpBlock')}
									</div>
									<div className="col-xs-12 p-0 title">
										<button {...common.isDisabled(!this.state.validate.value || this.props.createAppLoading)} className="col-xs-12 ad-theme-btn primary" onClick={() => this.handleSubmit()} >
											{this.props.createAppLoading ? (<Loading></Loading>) : null}
											<i className="fa fa-plus-circle"></i>&nbsp;&nbsp;New App
										</button>
									</div>
								</div>
							) : (
								<button className="col-xs-12 ad-theme-btn primary" onClick={() => this.showInput()} >
									<i className="fa fa-plus-circle"></i>&nbsp;&nbsp;New App
								</button>
							)
						}
					</div>
			</AppCard>
		);
	}

}
