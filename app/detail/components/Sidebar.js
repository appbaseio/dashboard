import React,{Component} from 'react';
import { Link } from 'react-router';
import { render } from 'react-dom';
import ReactTooltip from 'react-tooltip';
import classNames from "classnames";
import { eventEmitter } from '../../shared/helper';

export default class Sidebar extends Component {

	constructor(props) {
		super(props);
		this.state = {
			activeApp: this.props.appName,
			currentView: null
		};
		this.stopUpdate = false;
		this.links = [{
			label: 'Dashboard',
			link: `/dashboard/`,
			type: 'internal',
			name: 'dashboard',
			img: (<img className="img-responsive" src="../../../assets/images/dashboard.svg"></img>)
		}, {
			label: 'Browser',
			link: `/browser/`,
			type: 'internal',
			name: 'browser',
			img: (<img className="img-responsive" src="../../../assets/images/browser.svg"></img>)
		}, {
			label: 'Credentials',
			link: `/credentials/`,
			type: 'internal',
			name: 'credentials',
			img: (<img className="img-responsive" src="../../../assets/images/key.svg"></img>)
		}, {
			label: 'Team',
			link: `/team/`,
			type: 'internal',
			name: 'team',
			img: (<img className="img-responsive" src="../../../assets/images/team.svg"></img>)
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
				generatedEle = this.links.map((item, index) => {
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
