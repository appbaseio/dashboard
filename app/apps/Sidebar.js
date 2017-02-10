import {
	default as React,
	Component
} from 'react';
import { Link } from 'react-router';
import { render } from 'react-dom';

export class Sidebar extends Component {

	constructor(props) {
		super(props);
		this.links = [{
			label: 'Dashboard',
			link: 'app/'+this.props.appName,
			type: 'internal',
			name: 'Dashboard',
			img: (<i className="fa fa-table"></i>)
		}, {
			label: 'Data Browser',
			link: 'app/'+this.props.appName+'/dejavu',
			type: 'internal',
			name: 'dejavu',
			img: (<i className="fa fa-tachometer"></i>)
		}, {
			label: 'Data Mapper',
			link: 'app/'+this.props.appName+'/gem',
			type: 'internal',
			name: 'gem',
			img: (<img className="img-responsive" src="../../assets/images/GEM.svg"></img>)
		}, {
			label: 'Query Explorer',
			link: 'app/'+this.props.appName+'/gem',
			type: 'internal',
			name: 'mirage',
			img: (<img className="img-responsive" src="../../assets/images/GEM.svg"></img>)
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
					let img = (<div className="img-container">{item.img}</div>);
					let anchor = (<a className={this.props.currentView === item.name ? "active": ""} onClick={() => this.changeView(item.name)}>{img}{item.label}</a>);
					return (
						<li key={index}>
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
			<div className="sidebar-container">
				<ul className="sidebar">
					{this.renderElement('links')}
				</ul>
			</div>
		);
	}

}
