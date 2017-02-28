import {
	default as React,
	Component
} from 'react';
import { Link } from 'react-router';
import { render } from 'react-dom';
import { appbaseService } from '../service/AppbaseService';
import { urlShare } from '../service/tutorialService/UrlShare';
import {Loading} from '../others/Loading';

export class EsPlugin extends Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	componentWillMount() {
		this.initialize(this.props);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.appId != this.appId || nextProps.pluginName != this.pluginName) {
			this.initialize(nextProps);
		}
	}

	initialize(props) {
		this.appName = props.appName;
		this.appId = props.appId;
		this.plugin = props.pluginName.toLowerCase();
		this.setState({
			[this.plugin]: null
		}, this.getPermission);
	}

	getPermission() {
		appbaseService.getPermission(this.appId).then((data) => {
			this.setState({ permission: data }, this.createUrl);
		});
	}

	createUrl() {
		this.permission = this.state.permission;
		let obj = {
			url: 'https://'+this.permission.body[0].username+':'+this.permission.body[0].password+'@scalr.api.appbase.io',
			appname: this.props.appName
		};
		urlShare.compressInputState(obj).then((url) => {
			this.applyUrl(url);
		}).catch((error) => console.log(error));
	}

	applyUrl(url) {
		this.setState({
			gem: 'https://opensource.appbase.io/gem/#?input_state='+url+'&h=false&subscribe=false',
			dejavu: 'https://opensource.appbase.io/dejavu/live/#?input_state='+url+'&h=false&subscribe=false',
			mirage: 'https://opensource.appbase.io/mirage/#?input_state='+url+'&h=false&subscribe=false'
		});
	}

	renderElement(ele) {
		let generatedEle = null;
		switch (ele) {
			case 'iframe':
				if(this.state[this.plugin]) {
					generatedEle = (<iframe src={this.state[this.plugin]} height="100%" width="100%" frameBorder="0"></iframe>);
				} else {
					generatedEle = (<span className="col-xs-4 plugin-loading-container" ><Loading text="Loading"></Loading></span>);
				}
			break;
		}
		return generatedEle;
	}

	render() {
		return (
			<div className="plugin-container">
				{this.renderElement('iframe')}
			</div>
		);
	}

}
