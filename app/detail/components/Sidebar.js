import React,{Component} from 'react';
import { Link } from 'react-router';
import { render } from 'react-dom';
import ReactTooltip from 'react-tooltip';
import classNames from "classnames";

export default class Sidebar extends Component {

	constructor(props) {
		super(props);
		this.links = [{
			label: 'Dashboard',
			link: 'app/'+this.props.appName,
			type: 'internal',
			name: 'Dashboard',
			img: (<img className="img-responsive" src="../../assets/images/dashboard.svg"></img>)
		}, {
			label: 'Browser',
			link: 'app/'+this.props.appName+'/dejavu',
			type: 'internal',
			name: 'dejavu',
			img: (<img className="img-responsive" src="../../assets/images/browser.svg"></img>)
		}, {
			label: 'Credentials',
			link: 'app/'+this.props.appName+'/credentials',
			type: 'internal',
			name: 'credentials',
			img: (<img className="img-responsive" src="../../assets/images/key.svg"></img>)
		}, {
			label: 'Team',
			link: 'app/'+this.props.appName+'/collaborators',
			type: 'internal',
			name: 'collaborators',
			img: (<img className="img-responsive" src="../../assets/images/team.svg"></img>)
		}];
	}

	changeView(name) {
		this.props.changeView(name);
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
						<a data-tip={item.label} className={cx} onClick={() => this.changeView(item.name)}>
							{img}
							<span className="ad-detail-sidebar-item-label">
								{item.label}
							</span>
						</a>
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
