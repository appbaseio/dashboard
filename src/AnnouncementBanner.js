import React, { useState } from 'react';
import { css } from 'emotion';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { setAnnouncementBanner } from './actions';

const bannerStyles = css`
	.announcement-banner {
		background: #23263b;
		padding: 12px;
		color: #fff;
		display: flex;
		justify-content: center;
		font-size: 16px;
		.link-container {
			color: #fff;
			text-decoration: underline;
			&: hover {
				color: #1890ff;
			}
		}
		.close-icon {
			position: absolute;
			right: 30px;
			cursor: pointer;
		}
	}
`;
const AnnouncementBanner = () => {
	const [showBanner, setShowBanner] = useState(
		localStorage.getItem('announcementBanner') === 'true',
	);
	if (localStorage.getItem('announcementBanner') === null) {
		localStorage.setItem('announcementBanner', 'true');
		setShowBanner(true);
	}

	return (
		<div css={bannerStyles}>
			{showBanner ? (
				<div className="announcement-banner">
					<a
						className="link-container"
						href="https://www.appbase.io/"
					>
						appbase.io
					</a>
					&nbsp; is now &nbsp;
					<a
						className="link-container"
						href="https://www.reactivesearch.io/"
					>
						reactivesearch.io
					</a>{' '}
					<a href="#">&nbsp;[Read the announcement]</a>
					<img
						src="/static/images/close.svg"
						width={20}
						alt="close-icon"
						className="close-icon"
						onClick={() => {
							localStorage.setItem('announcementBanner', 'false');
							setShowBanner(false);
						}}
					/>
				</div>
			) : null}
		</div>
	);
};

export default AnnouncementBanner;
