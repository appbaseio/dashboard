import {
	default as React,
	Component
} from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router';
import { appbaseService } from '../service/AppbaseService';
import { Sidebar } from './Sidebar';
import { Dashboard } from './Dashboard';
import { EsPlugin } from './EsPlugin';

export class AppRoute extends Component {

	constructor(props) {
		super(props);
		this.changeView = this.changeView.bind(this);
		this.appName = null;
		this.state = {
			currentView: 'Dashboard'
		};
	}

	componentWillMount() {
		this.initialize(this.props);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.params.appId != this.appName) {
			this.initialize(nextProps);
		}
	}

	initialize(props) {
		this.appName = props.params.appId;
		this.appId = appbaseService.userInfo.body.apps[this.appName];
	}

	changeView(view) {
		this.setState({
			currentView: view
		});
	}

	renderElement(ele) {
		let generatedEle = null;
		switch (ele) {
			case 'loading':
				generatedEle = (<i className="fa fa-spinner fa-spin fa-1x fa-fw"></i>);
			break;
			case 'sidebar':
				generatedEle = (<Sidebar currentView={this.state.currentView} appName={this.appName} appId={this.appId} changeView={this.changeView.bind(this)} />);
			break;
			case 'view':
				switch(this.state.currentView) {
					case 'Dashboard':
						generatedEle = (<Dashboard appName={this.props.params.appId} />);
					break;
					case 'dejavu':
					case 'gem':
					case 'mirage':
						generatedEle = (<EsPlugin appName={this.props.params.appId} appId={this.appId} pluginName={this.state.currentView} />);
					break;
				}
				
			break;
		}
		return generatedEle;
	}

	render() {
		return (
			<div className="singleApp-container row">
				{this.renderElement('sidebar')}
				<div className="plugin-view-container">
					<div className="plugin-view">
						{this.renderElement('view')}
					</div>
				</div>
			</div>
		);
	}

}
