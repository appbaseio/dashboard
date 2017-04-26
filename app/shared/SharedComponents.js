import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import {Loader} from 'react-loaders';
import { appbaseService } from '../service/AppbaseService';
import { getConfig } from '../config';

export const AppOwner =(props) => {
	const isDifferentOwner = () => {
		return props.app && appbaseService && appbaseService.userInfo && appbaseService.userInfo.body && props.app.owner !== appbaseService.userInfo.body.email ? true : false;
	}
	return (
		<span className="ad-list-app-header-owner">
			{
				isDifferentOwner() ? (
					<span>
						<i data-tip={`Shared by ${props.app.owner}`} data-effect="solid" data-place="right" className="fa fa-share-alt app-owner-i"></i>
						<ReactTooltip />
					</span>
				) : null
			}
		</span>
	);
}

export const Loading =(props) => {
	return (
		<span className="ad-loading">
			<Loader type="ball-clip-rotate-multiple" active={true} />
		</span>
	);
}

export class OldDashboard extends Component {
	constructor(props) {
		super(props);
		const olddashboard = sessionStorage.getItem("olddashboard");
		this.state = {
			close: olddashboard === "close" ? true : false
		};
		this.onClose = this.onClose.bind(this);
	}
	onClose() {
		this.setState({
			close: true
		});
		sessionStorage.setItem("olddashboard", "close");
	}
	markup() {
		return (
			<span className="ad-olddashboard">
				You can switch back to the old dashboard by <a href="https://appbase.io/scalr/apps">clicking here.</a>
				<button onClick={this.onClose} type="button" className="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>
			</span>
		);
	}
	render() {
		return getConfig().name === "appbase" && !this.state.close ? this.markup() : null;
	}
}
