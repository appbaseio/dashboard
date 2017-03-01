import {
	default as React,
	Component
} from 'react';
import { Link } from 'react-router';
import { render } from 'react-dom';
import ReactTooltip from 'react-tooltip';
import classNames from "classnames";

export class Sidebar extends Component {

	constructor(props) {
		super(props);
		this.links = [{
			label: 'Dashboard',
			link: 'app/'+this.props.appName,
			type: 'internal',
			name: 'Dashboard',
			img: (<img className="img-responsive" src="../../assets/images/Dashboard.svg"></img>)
		}, {
			label: 'Data Browser',
			link: 'app/'+this.props.appName+'/dejavu',
			type: 'internal',
			name: 'dejavu',
			img: (<img className="img-responsive" src="../../assets/images/dejavu.svg"></img>)
		}, {
			label: 'Data Mapper',
			link: 'app/'+this.props.appName+'/gem',
			type: 'internal',
			name: 'gem',
			img: (<img className="img-responsive" src="../../assets/images/gem.svg"></img>)
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
						</a>
					);
					return (
						<li key={index}>
							{anchor}
							<ReactTooltip />
						</li>
					);
				})
				break;
		}
		return generatedEle;
	}

	render() {
		return (
			<div className="sidebar-container">
				<ul className="sidebar">
					{this.renderElement('links')}
				</ul>
			</div>
		);
	}

}
