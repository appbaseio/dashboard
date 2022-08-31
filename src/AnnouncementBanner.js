import React, { useState } from 'react';
import { css } from 'emotion';

const bannerStyles = css`
	.announcement-banner {
		padding: 5px;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 16px;
		.link-container {
			color: inherit;
			text-decoration: none;
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
					appbase.io is now reactivesearch.io.&nbsp;
					<a
						href="https://blog.reactivesearch.io/appbaseio-is-reactivesearch"
						target="_blank"
					>
						Read the announcement
					</a>
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
