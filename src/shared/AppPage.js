import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Sidebar from './Sidebar';
import config from '../config';
import { appbaseService } from '../service/AppbaseService';

const Page404 = () => (
	<div className="page404">
		<div className="row">
			<div className="col s12">
				<i className="fa fa-exclamation-triangle" />&nbsp; Seems like this app view doesn{
					"'"
				}t exist or you don{"'"}t have access to it.
			</div>
		</div>
		<div className="row">
			<div className="col s12">
				Go to{' '}
				<a href="/apps">
					/apps<i className="fa fa-cursor" />
				</a>
			</div>
		</div>
	</div>
);

export default class AppPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showChild: false,
		};
		this.selectedApp = this.props.pageInfo.appName;
		this.config = config;
		this.getAllApps();
	}
	componentWillReceiveProps() {
		if (this.props.pageInfo.appName !== this.selectedApp) {
			this.selectedApp = this.props.pageInfo.appName;
			this.getAllApps();
		}
	}
	isAllowed() {
		if (this.config.appDashboard.indexOf(this.props.pageInfo.currentView) < 0) {
			appbaseService.pushUrl('./apps');
		}
	}
	getAllApps() {
		appbaseService.allApps(true).then((data) => {
			const app = data.body.filter(app => this.props.pageInfo.appName === app.appname);
			this.setState({
				showChild: app && app.length ? true : null,
			});
		});
	}
	render() {
		this.isAllowed();
		const childrenWithProps = React.Children.map(this.props.children, child =>
			React.cloneElement(child, {}),);
		return (
			<div className="ad-detail row">
				<Sidebar
					currentView={this.props.pageInfo.currentView}
					appName={this.props.pageInfo.appName}
					appId={this.props.pageInfo.appId}
				/>
				<main className="ad-detail-view-container">
					<div className="ad-detail-view">
						{this.state.showChild ? childrenWithProps : null}
						{this.state.showChild === null ? <Page404 /> : null}
					</div>
				</main>
			</div>
		);
	}
}

AppPage.propTypes = {
	pageInfo: PropTypes.shape({
		currentView: PropTypes.string.isRequired,
		appName: PropTypes.string.isRequired,
		appId: PropTypes.oneOfType([PropTypes.number.isRequired, PropTypes.string.isRequired]),
	}),
};

// Default props value
AppPage.defaultProps = {};
