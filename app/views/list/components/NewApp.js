import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { appbaseService } from '../../../service/AppbaseService';
import { Loading } from "../../../shared/SharedComponents";
import { common } from "../../../shared/helper";
import AppCard from './AppCard';

export default class NewApp extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: this.props.showModal ? this.props.showModal : false,
			validate: {
				value: true,
				error: null
			},
			value: "",
			selectedEs: "es2.x",
			showInput: false,
			importer: false
		};
		this.errors = {
			'duplicate': 'Duplicate app',
			'required': 'Appname is required!',
			notavailable: "Appname is not available, please choose different name.",
			format: "Only use a-z,A-Z,0-9 and -._+$@ chars for the name."
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.open = this.open.bind(this);
		this.close = this.close.bind(this);
		this.gotoImporter = this.gotoImporter.bind(this);
	}
	close() {
		this.setState({ showModal: false });
	}
	open() {
		this.setState({ showModal: true });
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
			this.close();
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
			validate.error = this.errors['required'];
		} else {
			const patt = /^[a-zA-Z0-9_+-@$\.]+$/;
			if (!patt.test(appName)) {
				validate.value = false;
				validate.error = this.errors.format
			}
			else {
				let duplicateApp = this.props.apps.filter((app) => appName === app.appname);
				if (duplicateApp && duplicateApp.length) {
					validate.value = false;
					validate.error = this.errors['duplicate'];
				}
			}
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
		this.inputboxRef.focus();
		const appname = this.state.value.trim();
		if (appname) {
			this.setState({
				createAppLoading: true
			});
			appbaseService.isAppNameAvailable(appname)
				.then((data) => {
					this.checkAppValidation(data);
				}).catch((e) => {
					this.checkAppValidation(e);
				});
		}
	}
	checkAppValidation(data) {
		if(data && data.status && data.status === 404) {
			if(this.state.importer) {
				appbaseService.importerApp = this.state.value;
				this.gotoImporter();
			} else {
				this.props.createApp(this.state.value);
			}
			this.setState({
				createAppLoading: false
			});
		} else {
			const validate = {
				value: false,
				error: this.errors.notavailable
			};
			this.setState({
				validate,
				createAppLoading: false
			});
		}
	}
	chooseEs(selectedEs) {
		this.setState({
			selectedEs
		});
	}
	gotoImporter() {
		appbaseService.pushUrl("/importer");
	}
	changeImporter(importer) {
		this.setState({
			importer
		});
	}
	render() {
		return (
			<AppCard setClassName="appcard-newapp">
				<div className="ad-list-newapp">
					<button className="col-xs-12 ad-theme-btn primary" onClick={this.open} >
						<i className="fa fa-plus-circle"></i>&nbsp;&nbsp;New App
					</button>
					<Modal className="modal-info ad-list-newapp-modal" show={this.state.showModal} onHide={this.close}>
						<Modal.Header closeButton>
							<Modal.Title>New App</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<div className="row ad-list-newapp-form">
								<div className={"col-xs-12 form-group "+ (this.state.validate.error ? 'has-error' : '')}>
									<label>App name</label>
									<input ref={(input) => this.inputboxRef = input} type="text" placeholder="Enter an app name (no spaces)" value={this.state.value} className="form-control" onChange={this.handleChange} />
									{this.renderElement('helpBlock')}
								</div>
								<div className="col-xs-12 form-group">
									<label>Do you have a JSON or CSV dataset that you would like to import into the app?</label>
									<div>
										<label className="radio-inline">
											<input type="radio" name="inlineRadioOptions" id="inlineRadio1" checked={this.state.importer} onChange={() => this.changeImporter(true)} /> Yes
										</label>
										<label className="radio-inline">
											<input type="radio" name="inlineRadioOptions" id="inlineRadio2" checked={!this.state.importer} onChange={() => this.changeImporter(false)} /> No
										</label>
									</div>
								</div>
							</div>
							<div className="col-xs-12 p-0 ad-list-newapp-footer">
								<button className="ad-theme-btn  ad-confirm-btn " {...common.isDisabled(!this.state.validate.value || this.props.createAppLoading)} onClick={this.handleSubmit}>
									{this.props.createAppLoading || this.state.createAppLoading ? (<Loading></Loading>) : null}
									<i className="fa fa-plus-circle"></i>&nbsp;&nbsp;Create App
								</button>
							</div>
						</Modal.Body>
					</Modal>
				</div>
			</AppCard>
		)
	}
}

NewApp.propTypes = {};

// Default props value
NewApp.defaultProps = {}
