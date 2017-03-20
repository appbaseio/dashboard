import React,{Component} from 'react';
import { Link, browserHistory } from 'react-router';
import classNames from 'classnames';
import { getConfig } from '../config';
import { appbaseService } from '../service/AppbaseService';
import { eventEmitter, appListHelper } from './helper';
import { AppOwner } from './SharedComponents';

const _ = require("lodash");
const defaultImg = "../../../assets/images/userImg.png";

export default class Nav extends Component {

	constructor(props) {
		super(props);
		this.config = getConfig();
		this.contextPath = appbaseService.getContextPath();
		this.state = {
			activeApp: null,
			currentView: null,
			userImg: this.getUserImg()
		};
		this.appLink = {
			label: 'Apps',
			link: `${this.contextPath}apps`,
			type: 'internal'
		};
		this.links = [{
			label: 'Tutorial',
			link: `${this.contextPath}tutorial`,
			type: 'internal'
		}, {
			label: 'Docs',
			link: this.config.document,
			type: 'external'
		}, {
			label: 'Billing',
			link: `${this.contextPath}billing`,
			type: 'internal'
		}];
		this.options = ['name', 'email', 'logout'];
		this.currentActiveApp = null;
	}

	getAllApps(cb) {
		appbaseService.allApps(true).then((data) => {
			this.setState({
				apps: _.sortBy(data.body, 'appname')
			}, () => {
				if(cb) {
					cb.call(this);
				}
			});
		})
	}

	getUserImg() {
		return appbaseService.userInfo && appbaseService.userInfo.body && appbaseService.userInfo.body && appbaseService.userInfo.body.details
		? ( appbaseService.userInfo.body.details.picture ? appbaseService.userInfo.body.details.picture : appbaseService.userInfo.body.details.avatar_url)
		: defaultImg;
	}

	componentWillMount() {
		if(appbaseService.extra.nav) {
			this.getAllApps(() => {
				this.setState(appbaseService.extra.nav);
			});
		}
		this.listenEvent = eventEmitter.addListener('activeApp', (activeApp) => {
			this.getAllApps(() => {
				this.setState(activeApp);
			});
		});
	}

	componentWillUnmount() {
		if (this.listenEvent) {
			this.listenEvent.remove();
		}
	}

	onUserImgFailed() {
		this.setState({
			userImg: defaultImg
		});
	}

	renderElement(ele) {
		let generatedEle = null;
		switch (ele) {
			case 'appLink':
				generatedEle = (
					<li>
						<Link to={this.appLink.link}>
							<span className="icon-container">
								<img src="../../../assets/images/newapp.svg" alt="" className="img-responsive"/>
							</span>
							{this.appLink.label}
						</Link>
					</li>
				);
			break;
			case 'apps':
				if(this.state.apps && this.state.activeApp) {
					generatedEle = [];
					this.state.apps.forEach((app, index) => {
						let appLink = (
							<li key ={index}>
								<Link to={`${this.contextPath}${this.state.currentView}/${app.appname}`}>
									{app.appname}
									<AppOwner app={app} />
								</Link>
							</li>
						);
						if(app !== this.state.activeApp) {
							generatedEle.push(appLink);
						}
					});
				}
			break;
			case 'currentApp':
				if(this.state.activeApp && this.state.apps) {
					const apps = this.state.apps.filter((app) => app.appname === this.state.activeApp);
					generatedEle = (
						<li role="presentation" className="dropdown">
							<a className="dropdown-toggle apps-dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
								<i className="fa fa-chevron-right dropdown-chevron"></i>&nbsp;
								{apps[0].appname} <AppOwner app={apps[0]} />
							</a>
							<ul className="dropdown-menu pull-right">
								{this.renderElement('apps')}
							</ul>
						</li>
					);
				}
			break;
			case 'links':
				generatedEle = this.links.map((item, index) => {
					let anchor = (<a href={item.link} target="_blank">{item.label}</a>);
					if(item.type === 'internal') {
						anchor = (<Link to={item.link}>{item.label}</Link>);
					}
					return (
						<li key={index}>
							{anchor}
						</li>
					);
				})
			break;
			case 'userImg':
				if(appbaseService.userInfo && appbaseService.userInfo.body && appbaseService.userInfo.body.details) {
					generatedEle = (
						<li>
							<ul className="ad-user-info-list hidden-xs">
								<li className="ad-dropdown dropdown without-icon logout-dropdown extra-link">
									<a className="dropdown-toggle user-img-container" type="button" id="userimg-menu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
										<button className="user-img">
											<span className="img-container">
												<img src={this.state.userImg} className="img-responsive" alt={appbaseService.userInfo.body.details.name} onError={() => this.onUserImgFailed()} />
											</span>
										</button>
									</a>
									<ul className="ad-dropdown-menu dropdown-menu pull-right" aria-labelledby="userimg-menu">
										{
											this.options.map((item) => (
												<li key={item}>
													<a onClick={() => this.logout(item)}>
														{
															item === 'logout' ?
															(<span className="text-danger"><i className="fa fa-sign-out"></i> Logout</span>) :
															appbaseService.userInfo.body.details[item]
														}
													</a>
												</li>
											))
										}
									</ul>
								</li>
							</ul>
							<ul className="visible-xs ad-user-info-list">
								<li>
									<a>
										{appbaseService.userInfo.body.details.name} ({appbaseService.userInfo.body.details.email})
									</a>
								</li>
								<li>
									<a onClick={() => this.logout('logout')}>
										<span className="text-danger"><i className="fa fa-sign-out"></i> Logout</span>
									</a>
								</li>
							</ul>
						</li>
					);
				}
			break;
		}
		return generatedEle;
	}

	logout(item) {
		if(item === 'logout') {
			appbaseService.logout();
		}
	}

	render() {
		const cx = classNames({
			"brand-with-text": this.config.logoText
		});
		return (
			<nav className="navbar navbar-default">
				<div className="container-fluid">
					<div className="navbar-header">
						<button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
							<span className="sr-only">Toggle navigation</span>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
						</button>
						<Link to="/apps" className={`navbar-brand ${cx}`}>
							<img src={this.config.logo} alt="" className="img-responsive"/>
							{
								this.config.logoText ? (<span>Reactive Maps</span>) : null
							}
						</Link>
					</div>
					<div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
						<ul className="nav navbar-nav nav-app pull-left">
							{this.renderElement('appLink')}
							{this.renderElement('currentApp')}
						</ul>
						<ul className="nav navbar-nav pull-right">
							{this.renderElement('links')}
							{this.renderElement('userImg')}
						</ul>
					</div>
				</div>
			</nav>
		);
	}

}
