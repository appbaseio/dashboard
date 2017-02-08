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
			link: '/dashboard',
			type: 'internal',
			img: (<i className="fa fa-table"></i>)
		}, {
			label: 'Data Browser',
			link: '/browser',
			type: 'internal',
			img: (<i className="fa fa-tachometer"></i>)
		}, {
			label: 'Data Mapper',
			link: '/mapper',
			type: 'internal',
			img: (<img className="img-responsive" src="../../assets/images/GEM.svg"></img>)
		}];
	}

	renderElement(ele) {
		let generatedEle = null;
		switch (ele) {
			case 'links':
				generatedEle = this.links.map((item, index) => {
					let img = (<div className="img-container">{item.img}</div>);
					let anchor = (<a href={item.link} target="_blank">{img}{item.label}</a>);
					if(item.type === 'internal') {
						anchor = (<Link to={item.link}>{img}{item.label}</Link>);
					}
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
