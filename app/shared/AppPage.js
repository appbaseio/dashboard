import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import Sidebar from './Sidebar';
import { getConfig } from '../config';

export default class AppPage extends Component {
	constructor(props) {
		super(props);
		this.config = getConfig();
	}
	isAllowed() {
		if(this.config.appDashboard.indexOf(this.props.pageInfo.currentView) < 0) {
			browserHistory.push('./apps');
		}
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
						{childrenWithProps}
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