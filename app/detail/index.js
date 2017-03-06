import React, { Component } from 'react';
import { render } from 'react-dom';
import { Link, browserHistory } from 'react-router';
import { appbaseService } from '../service/AppbaseService';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import EsPlugin from './components/EsPlugin';
import CredentialsPage from './components/credentials';
import CollabPage from './components/collaborators';

export default class Detail extends Component {

	constructor(props) {
		super(props);
		this.changeView = this.changeView.bind(this);
		this.appName = null;
		this.currentView = null;
	}

	componentWillMount() {
		this.initialize(this.props);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.params.appId != this.appName || nextProps.params.page != this.currentView) {
			this.initialize(nextProps);
		}
	}

	initialize(props) {
		this.appName = props.params.appId;
		this.appId = appbaseService.userInfo.body.apps[this.appName];
		if(props.params.page) {
			this.currentView = props.params.page;
		} else {
			this.changeView('Dashboard');
		}
	}

	changeView(view) {
		browserHistory.push(`/dashboard/app/${this.appName}/${view}`);
	}

	renderElement(ele) {
		let generatedEle = null;
		switch (ele) {
			case 'loading':
				generatedEle = (<i className="fa fa-spinner fa-spin fa-1x fa-fw"></i>);
				break;
			case 'sidebar':
				generatedEle = (<Sidebar currentView={this.currentView} appName={this.appName} appId={this.appId} changeView={this.changeView.bind(this)} />);
				break;
			case 'view':
				switch (this.currentView) {
					case 'Dashboard':
					case 'dashboard':
					default:
						generatedEle = (<Dashboard appName={this.props.params.appId} />);
						break;
					case 'credentials':
					case 'Credentials':
						generatedEle = (<CredentialsPage appName={this.props.params.appId} />);
						break;
					case 'collaborators':
					case 'Collaborators':
						generatedEle = (<CollabPage appName={this.props.params.appId} />);
						break;
					case 'browser':
					case 'Browser':
						generatedEle = (<EsPlugin appName={this.props.params.appId} appId={this.appId} pluginName="dejavu" />);
						break;
				}

				break;
		}
		return generatedEle;
	}

	render() {
		return (
			<div className="ad-detail row">
				{this.renderElement('sidebar')}
				<main className="ad-detail-view-container">
					<div className="ad-detail-view">
						{this.renderElement('view')}
					</div>
				</main>
			</div>
		);
	}

}
