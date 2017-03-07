import React, { Component } from 'react';
import { render } from 'react-dom';
import { Link, browserHistory } from 'react-router';
import Onboarding from 'appbase-onboarding';
import { appbaseService } from '../../service/AppbaseService';
import AppCreation from './steps/AppCreation';
import UpdateMapping from './steps/UpdateMapping';
import IndexData from './steps/IndexData';
import LiveFiddle from './steps/LiveFiddle';

export default class Tutorial extends Component {

	constructor(props) {
		super(props);
		this.steps = [
			'Create an app',
			'Define data model',
			'Index data',
			'Live APP',
			'App UI'
		];
	}

	render() {
		return (
			<section id="onboarding-container" className="text-center">
				<Onboarding
					brandImage='../../assets/images/logo.png'
					steps={this.steps}>
						<AppCreation key={3} />
						<UpdateMapping key={1} />
						<IndexData key={2} />
						<LiveFiddle key={0} />
				</Onboarding>
			</section>
		);
	}

}
