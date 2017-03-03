import React, { Component } from 'react';
import { appbaseService } from '../../service/AppbaseService';
import ShareCard from './ShareCard';
import NewShare from './NewShare';

export default class CollabPage extends Component {
	constructor(props, context) {
		super(props);
		this.state = {
			info: null
		};
		this.getInfo = this.getInfo.bind(this);
		this.newShare = this.newShare.bind(this);
	}

	componentWillMount() {
		this.stopUpdate = false;
		this.initialize(this.props);
	}

	componentWillUnmount() {
		this.stopUpdate = true;
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.appName != this.appName) {
			this.initialize(nextProps);
		}
	}

	initialize(props) {
		this.appName = props.appName;
		this.appId = appbaseService.userInfo.body.apps[this.appName];
		this.getInfo();
	}

	getInfo() {
		this.info = {};
		appbaseService.getShare(this.appId).then((data) => {
			this.info.share = data;
			if(!this.stopUpdate) {
				this.setState({ info: this.info });
			}
		});
	}

	newShare(request) {
		appbaseService.newShare(this.appId, request).then((data) => {
			this.getInfo();
		});
	}

	renderElement(method) {
		let element = null;
		switch(method) {
			case 'share':
				if(this.state.info && this.state.info.share) {
					element = this.state.info.share.body.map((shareInfo, index) => {
						return (
							<ShareCard 
								appId={this.appId}
								key={index}
								shareInfo={shareInfo}
								getInfo={this.getInfo}
							/>
						);
					})
				}
			break;
		}
		return element;
	}

	render() {
		return (
			<section className="singleApp row">
				<div className="page-info col-xs-12">
					<h2 className="page-title">Collaborators</h2>
				</div>
				<NewShare newShare={this.newShare} />
				<div className="page-body col-xs-12">
					{this.renderElement('share')}
				</div>
			</section>
		);
	}
}
