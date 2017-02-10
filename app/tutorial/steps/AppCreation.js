import React, { Component } from 'react';
import { dataOperation } from '../../service/tutorialService/DataOperation';

export default class AppCreation extends Component {
	constructor(props) {
		super(props);
		this.state = {
			appName: '',
			readOnly: false,
			url: null,
			error: false,
			appnameValidation: false
		};
		this.errorMsg = '';
		this.appNameChange = this.appNameChange.bind(this);
		this.createUrl = this.createUrl.bind(this);
		this.showError = this.showError.bind(this);
	}

	componentDidMount() {
		if (dataOperation.app && dataOperation.app.appName) {
			this.setState({
				appName: dataOperation.app.appName,
				readOnly: true
			});
			dataOperation.createUrl(this.createUrl);
		}
	}

	appNameChange(event) {
		let inputVal = event.target.value;
		var patt = /^[a-zA-Z0-9_+-@$\.]+$/;
		if (!patt.test(inputVal)) {
			this.errorMsg = 'Only use a-z,A-Z,0-9 and any of -._+$@ chars for the app name.'
		}
		this.setState({
			appName: inputVal,
			appnameValidation: patt.test(inputVal),
			error: !patt.test(inputVal)
		});
	}

	submit() {
		if (this.state.appName.trim() != '') {
			if (dataOperation.user && dataOperation.user.apps && !dataOperation.user.apps.hasOwnProperty(this.state.appName)) {
				this.createApp();
			} else {
				this.errorMsg = this.state.appName + ' already exists!';
				this.setState({
					error: true
				});
			}
		} else {
			this.errorMsg = 'App name should not be empty.';
			this.setState({
				error: true
			});
		}
	}

	createApp() {
		dataOperation.createApp(this.state.appName).done((res) => {
			if (res.message === 'App Created') {
				this.setState({
					readOnly: true
				});
				res.body.appName = this.state.appName;
				dataOperation.updateApp(res.body);
				dataOperation.createUrl(this.createUrl);
				this.props.nextStep();
			} else {
				this.errorMsg = 'Some error occured. Please try again!';
				this.setState({
					error: true
				});
			}
		}).fail((res) => {
			if(res && res.responseJSON && res.responseJSON.Message && res.responseJSON.Message.indexOf('UNIQUE KEY') > 0) {
				this.errorMsg = 'An app with the same name already exists!';
			} else {
				this.errorMsg = res.responseText;
			}
			this.setState({
				error: true
			});
		});
	}

	createUrl(url) {
		this.setState({
			url: url
		});
	}

	showError() {
		return (
			<div className="error-box">
				{this.errorMsg}
			</div>
		)
	}

	submitBtn() {
		let btn;
		if (this.state.readOnly) {
			btn = (
				<button className="btn btn-primary submit-btn" onClick={() => this.props.nextStep()}>
					Next
				</button>
			);
		} else {
			let readonly;
			if (!this.state.appnameValidation) {
				readonly = {
					disabled: !this.state.appnameValidation
				};
			}
			btn = (
				<button {...readonly} className="btn btn-primary submit-btn" onClick={() => this.props.nextStep()}>
					Submit
				</button>
			);
		}
		return btn;
	}

	render() {
		let readOnly = {
			readOnly: this.state.readOnly
		};

		return (
		  <section className="step">
			<h2>Create an app</h2>
			<p>
				First things first, we will start by creating an appbase.io app. This is where all the data will reside once our maps app is up and running.
			</p>

			{this.state.error ? this.showError(): null}

			<div className="row">
				<div className="input-field">
					<label {...readOnly}>
						<span>Enter app name</span>
						<input type="text"
							className="form-control"
							onChange={this.appNameChange}
							value={this.state.appName} />
					</label>
					{this.submitBtn()}
				</div>
			</div>
		  </section>
		);
	}
}

AppCreation.propTypes = {};
// Default props value
AppCreation.defaultProps = {};
