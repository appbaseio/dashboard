import React from 'react';
import { Loader } from 'react-loaders';
import Tooltip from 'rc-tooltip';
import { appbaseService } from '../service/AppbaseService';

export const AppOwner = props => {
	const isDifferentOwner = () =>
		!!(
			props.app &&
			appbaseService &&
			appbaseService.userInfo &&
			appbaseService.userInfo.body &&
			props.app.owner !== appbaseService.userInfo.body.email
		);
	return (
		<span className="ad-list-app-header-owner">
			{isDifferentOwner() ? (
				<Tooltip overlay={<div>{`Shared by ${props.app.owner}`}</div>} mouseLeaveDelay={0}>
					<span>
						<i
							aria-label={`Shared by ${props.app.owner}`}
							data-effect="solid"
							data-place="right"
							className="fa fa-share-alt app-owner-i"
						/>
					</span>
				</Tooltip>
			) : null}
		</span>
	);
};

export const Loading = () => (
	<span className="ad-loading">
		<Loader type="ball-pulse-sync" color="#B6EF7E" active />
	</span>
);
