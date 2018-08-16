import React, { Component } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';
import Tooltip from 'rc-tooltip';
import { eventEmitter } from './helper';
import config from '../config';
import { appbaseService } from '../service/AppbaseService';

export default class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.config = config;
		this.contextPath = appbaseService.getContextPath();
		this.state = {
			activeApp: this.props.appName,
		};
		this.stopUpdate = false;
		this.links = [
			{
				label: 'Dashboard',
				link: `${this.contextPath}dashboard/`,
				type: 'internal',
				name: 'dashboard',
				tooltip: 'View app usage stats',
				img: (
					<img
						className="img-responsive"
						alt="dashboard"
						src={`../../../assets/images/${this.config.name}/sidebar/dashboard.svg`}
					/>
				),
			},
			{
				label: 'Mappings',
				link: `${this.contextPath}mappings/`,
				type: 'internal',
				name: 'mappings',
				tooltip: 'View or update mappings',
				img: (
					<img
						className="img-responsive"
						alt="mappings"
						src={`../../../assets/images/${this.config.name}/sidebar/mapping.svg`}
					/>
				),
			},
			{
				label: 'Browser',
				link: `${this.contextPath}browser/`,
				type: 'internal',
				name: 'browser',
				tooltip: 'Create, view and manage app data',
				img: (
					<img
						className="img-responsive"
						alt="browser"
						src={`../../../assets/images/${this.config.name}/sidebar/browser.svg`}
					/>
				),
			},
			{
				label: 'Search Sandbox',
				link: `${this.contextPath}search-sandbox/`,
				type: 'internal',
				name: 'search-sandbox',
				tooltip: 'Update search preferences',
				img: (
					<img
						className="img-responsive"
						alt="search-sandbox"
						src={`../../../assets/images/${this.config.name}/sidebar/sandbox.svg`}
					/>
				),
			},
			{
				label: 'Analytics',
				link: `${this.contextPath}analytics/`,
				type: 'internal',
				name: 'analytics',
				tooltip: 'View app analytics',
				img: (
					<img
						className="img-responsive"
						alt="analytics"
						src={`../../../assets/images/${this.config.name}/sidebar/dashboard.svg`}
					/>
				),
			},
			{
				label: 'Credentials',
				link: `${this.contextPath}credentials/`,
				type: 'internal',
				name: 'credentials',
				tooltip: 'View and manage API access credentials',
				img: (
					<img
						className="img-responsive"
						alt="credentials"
						src={`../../../assets/images/${this.config.name}/sidebar/credentials.svg`}
					/>
				),
			},
			{
				label: 'Team',
				link: `${this.contextPath}team/`,
				type: 'internal',
				name: 'team',
				tooltip: 'Manage who can access your app data',
				img: (
					<img
						className="img-responsive"
						alt="team"
						src={`../../../assets/images/${this.config.name}/sidebar/team.svg`}
					/>
				),
			},
		];
	}

	changeView(name) {
		this.props.changeView(name);
	}

	componentWillMount() {
		this.listenEvent = eventEmitter.addListener('activeApp', (activeApp) => {
			if (!this.stopUpdate) {
				this.setState(activeApp);
			}
		});
	}

	componentDidMount() {
		const seSidebarHeight = () => {
			$('.ad-detail').css({
				'min-height': $(this.sidebarRef).height() + 30,
			});
		};
		setTimeout(seSidebarHeight.bind(this), 1000);
		$(window).resize(seSidebarHeight.bind(this));
	}

	componentWillUnmount() {
		this.stopUpdate = true;
		if (this.listenEvent) {
			this.listenEvent.remove();
		}
		$(window).unbind('resize');
	}

	renderElement(ele) {
		let generatedEle = null;
		switch (ele) {
			case 'links': {
				const filteredList = this.links.filter(item =>
					this.config.appDashboard.indexOf(item.name) > -1);
				generatedEle = filteredList.map((item, index) => {
					const cx = classNames({
						active: this.props.currentView === item.name,
					});
					const img = <div className="img-container">{item.img}</div>;
					const anchor = (
						<Link className={cx} to={item.link + this.state.activeApp}>
							{img}
							<span className="ad-detail-sidebar-item-label">{item.label}</span>
						</Link>
					);
					return (
						<Tooltip
							overlay={<div>{item.tooltip}</div>}
							mouseLeaveDelay={0}
							key={`${item.name}-${index + 1}`}
						>
							<li
								className="ad-detail-sidebar-item"
								key={`${item.name}-item-${index + 1}`}
							>
								{anchor}
							</li>
						</Tooltip>
					);
				});
				break;
			}
			default: {
				break;
			}
		}
		return generatedEle;
	}

	render() {
		return (
			<aside className="ad-detail-sidebar">
				<ul
					className="ad-detail-sidebar-container"
					ref={(aside) => {
						this.sidebarRef = aside;
					}}
				>
					{this.renderElement('links')}
				</ul>
			</aside>
		);
	}
}
