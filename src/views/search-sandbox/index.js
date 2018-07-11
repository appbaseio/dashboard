import React, { Component } from 'react';
import { Link } from 'react-router';
import AppPage from '../../shared/AppPage';
import { appbaseService } from '../../service/AppbaseService';

const navLinks = [
	{
		label: 'Editor',
		link: 'editor',
	},
	{
		label: 'UI Demos',
		link: 'ui-demos',
	},
	{
		label: 'Settings',
		link: 'settings',
	},
];

export default class SearchSandbox extends Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	render() {
		const appName = this.props.params.appId;
		const appId = appbaseService.userInfo.body.apps[appName];
		this.pageInfo = {
			currentView: 'search-sandbox',
			appName,
			appId,
		};
		return (
			<AppPage pageInfo={this.pageInfo}>
				<div className="ad-detail-page ad-dashboard row sandbox-wrapper">
					<nav>
						<ul>
							{
								navLinks.map(item => (
									<li key={item.link}>
										<Link activeClassName="active" to={`/search-sandbox/${appName}/${item.link}`}>{item.label}</Link>
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
