import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import Sidebar from './Sidebar';
import { getConfig } from '../config';
import { appbaseService } from '../service/AppbaseService';

const Page404 = (props) => {
	return (
		<div className="page404">
			<i className="fa fa-exclamation-triangle"></i>&nbsp; App not found!
		</div>
	);
};

export default class AppPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showChild: false
		};
		this.selectedApp = this.props.pageInfo.appName;
		this.config = getConfig();
		this.getAllApps();
	}
	componentWillReceiveProps() {
		if(this.props.pageInfo.appName !== this.selectedApp) {
			this.selectedApp = this.props.pageInfo.appName;
			this.getAllApps();
		}
	}
	isAllowed() {
		if(this.config.appDashboard.indexOf(this.props.pageInfo.currentView) < 0) {
			appbaseService.pushUrl('./apps');
		}
	}
	getAllApps() {
		appbaseService.allApps(true).then((data) => {
			const app = data.body.filter(app => this.props.pageInfo.appName === app.appname);
			this.setState({
				showChild: app && app.length ? true : null
			});
		})
	}
	render() {
		this.isAllowed();
		const childrenWithProps = React.Children.map(this.props.children,
			(child) => React.cloneElement(child, {
			})
		);
		return (
			<div className="ad-detail row">
				<Sidebar
					currentView={this.props.pageInfo.currentView}
					appName={this.props.pageInfo.appName} 
					appId={this.props.pageInfo.appId}
				/>
				<main className="ad-detail-view-container">
					<div className="ad-detail-view">
						{this.state.showChild ? childrenWithProps : null }
						{this.state.showChild === null ? (<Page404></Page404>) : null }
					</div>
				</main>
			</div>
		)
	}
}

AppPage.propTypes = {
	pageInfo: React.PropTypes.shape({
		currentView: React.PropTypes.string.isRequired,
		appName: React.PropTypes.string.isRequired,
		appId: React.PropTypes.oneOfType([
			React.PropTypes.number.isRequired,
			React.PropTypes.string.isRequired
		])
	})
};

// Default props value
AppPage.defaultProps = {}