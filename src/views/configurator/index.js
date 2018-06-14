import React, { Component } from 'react';
import { Link } from 'react-router';
import AppPage from '../../shared/AppPage';
import { appbaseService } from '../../service/AppbaseService';

const navLinks = [
	{
		label: 'Query Tester',
		link: 'query-tester',
	},
	{
		label: 'Manage Mappings',
		link: 'manage-mappings',
	},
	{
		label: 'Query Engine',
		link: 'query-engine',
	},
	{
		label: 'Display',
		link: 'display',
	},
	{
		label: 'Logs',
		link: 'logs',
	},
	{
		label: 'UI Demos',
		link: 'ui-demos',
	},
];

export default class Configurator extends Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	render() {
		const appName = this.props.params.appId;
		const appId = appbaseService.userInfo.body.apps[appName];
		this.pageInfo = {
			currentView: 'configurator',
			appName,
			appId,
		};
		return (
			<AppPage pageInfo={this.pageInfo}>
				<div className="ad-detail-page ad-dashboard row configurator-wrapper">
					<nav>
						<ul>
							{
								navLinks.map(item => (
									<li key={item.link}>
										<Link activeClassName="active" to={`/configurator/${appName}/${item.link}`}>{item.label}</Link>
									</li>
								))
							}
						</ul>
					</nav>

					{
						React.Children.map(this.props.children, child =>
							React.cloneElement(child, { appId, appName }))
					}
				</div>
			</AppPage>
		);
	}
}
