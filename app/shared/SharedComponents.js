import React from 'react';
import ReactTooltip from 'react-tooltip';
import { appbaseService } from '../service/AppbaseService';

export const AppOwner =(props) => {
	const isDifferentOwner = () => {
		return props.app && props.app.appInfo && appbaseService && appbaseService.userInfo && appbaseService.userInfo.body && props.app.appInfo.owner !== appbaseService.userInfo.body.email ? true : false;
	}
	return (
		<span className="ad-list-app-header-owner">
			{
				isDifferentOwner() ? (
					<span>
						<i data-tip={`Owned by ${props.app.appInfo.owner}`} data-place="right" className="fa fa-share-alt"></i>
						<ReactTooltip />
					</span>
				) : null
			}
		</span>
	);
}
