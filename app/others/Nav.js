import {
	default as React,
	Component
} from 'react';
import { Link, browserHistory } from 'react-router';
import { render } from 'react-dom';
import { appbaseService } from '../service/AppbaseService';

export class Nav extends Component {

	constructor(props) {
		super(props);
		this.links = [{
			label: 'Apps',
			link: '/apps',
			type: 'internal'
		}, {
			label: 'Document',
			link: 'https://opensource.appbase.io/reactivemaps-manual',
			type: 'external'
		}, {
			label: 'Tutorial',
			link: '/tutorial',
			type: 'internal'
		}, {
			label: 'Billing',
			link: '/billing',
			type: 'internal'
		}];
	}

	renderElement(ele) {
		let generatedEle = null;
		switch (ele) {
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
							<button className="userImg" onClick={()=>this.logout()}>
								<span className="img-container">
									<img src={appbaseService.userInfo.body.details.picture} className="img-responsive" alt={appbaseService.userInfo.body.details.name} />
									<div className="close"><i className="fa fa-times"></i></div>
								</span>
							</button>
						</li>
					);
				}
			break;
		}
		return generatedEle;
	}

	logout() {
		appbaseService.logout();
	}

	render() {
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
						<a className="navbar-brand" href="#">
							<img src="../../assets/images/logo.png" alt="" className="img-responsive"/>
						</a>
					</div>
					<div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
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
