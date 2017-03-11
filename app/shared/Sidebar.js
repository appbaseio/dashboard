import React,{Component} from 'react';
import { Link } from 'react-router';
import ReactTooltip from 'react-tooltip';
import classNames from "classnames";
import { eventEmitter } from './helper';
import { getConfig } from '../config';
import { appbaseService } from '../service/AppbaseService';

export default class Sidebar extends Component {

	constructor(props) {
		super(props);
		this.config = getConfig();
		this.contextPath = appbaseService.getContextPath();
		this.state = {
			activeApp: this.props.appName,
			currentView: null
		};
		this.stopUpdate = false;
		this.links = [{
			label: 'Dashboard',
			link: `${this.contextPath}dashboard/`,
			type: 'internal',
			name: 'dashboard',
			img: (<img className="img-responsive" src="../../../assets/images/sidebar/dashboard.svg"></img>)
		}, {
			label: 'Browser',
			link: `${this.contextPath}browser/`,
			type: 'internal',
			name: 'browser',
			img: (<img className="img-responsive" src="../../../assets/images/sidebar/browser.svg"></img>)
		}, {
			label: 'Gem',
			link: `${this.contextPath}gem/`,
			type: 'internal',
			name: 'gem',
			img: (<img className="img-responsive" src="../../../assets/images/sidebar/gem.svg"></img>)
		},{
			label: 'Mirage',
			link: `${this.contextPath}mirage/`,
			type: 'internal',
			name: 'mirage',
			img: (<img className="img-responsive" src="../../../assets/images/sidebar/mirage.svg"></img>)
		}, {
			label: 'Credentials',
			link: `${this.contextPath}credentials/`,
			type: 'internal',
			name: 'credentials',
			img: (<img className="img-responsive" src="../../../assets/images/sidebar/credentials.svg"></img>)
		}, {
			label: 'Team',
			link: `${this.contextPath}team/`,
			type: 'internal',
			name: 'team',
			img: (<img className="img-responsive" src="../../../assets/images/sidebar/team.svg"></img>)
		}];
	}

	changeView(name) {
		this.props.changeView(name);
	}

	componentWillMount() {
		this.listenEvent = eventEmitter.addListener('activeApp', (activeApp) => {
			if(!this.stopUpdate) {
				this.setState(activeApp);
			}
		});
	}

	componentWillUnmount() {
		this.stopUpdate = true;
		if (this.listenEvent) {
			this.listenEvent.remove();
		}
	}

	renderElement(ele) {
		let generatedEle = null;
		switch (ele) {
			case 'links':
				const filteredList = this.links.filter((item) => this.config.appDashboard.indexOf(item.name) > -1);
				generatedEle = filteredList.map((item, index) => {
					const cx = classNames({
						"active": this.props.currentView === item.name
					});
					const img = (<div className="img-container">{item.img}</div>);
					const anchor = (
						<Link className={cx} to={item.link+this.state.activeApp}>
							{img}
							<span className="ad-detail-sidebar-item-label">
								{item.label}
							</span>
						</Link>
					);
					return (
						<li className="ad-detail-sidebar-item" key={index}>
							{anchor}
						</li>
					);
				})
				break;
		}
		return generatedEle;
	}

	render() {
		return (
			<aside className="ad-detail-sidebar">
				<ul className="ad-detail-sidebar-container">
					{this.renderElement('links')}
				</ul>
			</aside>
		);
	}

}
