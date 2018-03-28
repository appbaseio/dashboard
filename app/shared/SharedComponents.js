import React, { Component } from 'react';
import {Loader} from 'react-loaders';
import Tooltip from 'rc-tooltip';
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
					<Tooltip
						overlay={<div>{`Shared by ${props.app.owner}`}</div>}
						mouseLeaveDelay={0}
					>
						<span>
							<i aria-label={`Shared by ${props.app.owner}`} data-effect="solid" data-place="right" className="fa fa-share-alt app-owner-i"></i>
						</span>
					</Tooltip>
				) : null
			}
		</span>
	);
}

export const Loading =(props) => {
	return (
		<span className="ad-loading">
			<Loader type="ball-pulse-sync" color="#B6EF7E" active={true} />
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
