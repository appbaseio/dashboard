import {
	default as React,
	Component
} from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router';
import { appbaseService } from '../service/AppbaseService';

export class Topbar extends Component {

	constructor(props) {
		super(props);
		this.apps = appbaseService.userInfo.body.apps;
	}

	componentWillMount() {
		this.initialize(this.props);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.appId != this.appId) {
			this.initialize(nextProps);
		}
	}

	initialize(props) {
		this.appName = props.appName;
		this.appId = props.appId;
	}

	renderElement(ele) {
		let generatedEle = null;
		switch (ele) {
			case 'appLink':
				generatedEle = [];
				Object.keys(this.apps).forEach((app, index) => {
					let appLink = (
						<li key ={index}>
							<Link to={`/app/${app}`}>{app}</Link>
						</li>
					);
					if(app !== this.appName) {
						generatedEle.push(appLink);
					}
				});
			break;
		}
		return generatedEle;
	}

	render() {
		return (
			<div className="topbar">
				<nav className="navbar navbar-default">
					<div className="container-fluid">
						<div className="navbar-header">
							<button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-2" aria-expanded="false">
								<span className="sr-only">Toggle navigation</span>
								<span className="icon-bar"></span>
								<span className="icon-bar"></span>
								<span className="icon-bar"></span>
							</button>
						</div>
						<div className="collapse navbar-collapse" id="bs-example-navbar-collapse-2">
							<ul className="nav navbar-nav pull-left">
								<li>
									<Link to='/apps'>Apps</Link>
									<span className="breadcrumb">&gt;</span>
								</li>
								<li role="presentation" className="dropdown">
									<a className="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
										{this.appName} <span className="caret"></span>
									</a>
									<ul className="dropdown-menu pull-right">
										{this.renderElement('appLink')}
									</ul>
								</li>
							</ul>
						</div>
					</div>
				</nav>
			</div>
		);
	}

}
