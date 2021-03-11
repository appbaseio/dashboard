import React from 'react';
import { css, cx } from 'react-emotion';
import { string, object } from 'prop-types';
import { media, mediaKey } from '../../utils/media';

const styles = css`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
	margin-top: 20px;
	img {
		max-width: 35%;
		margin: 20px;
		${media.medium(css`
			max-width: 30%;
			margin: 30px 5px;
		`)};
	}
`;

const headingCls = css({
	textAlign: 'center',
	paddingTop: 10,
	fontSize: '1.7em',
	fontWeight: '100 !important',
	maxWidth: '900px',
	color: '#232E44',
	[mediaKey.medium]: {
		fontSize: '1.375rem',
	},
});

const AppbaseUsers = ({ className, style, title }) => (
	<React.Fragment>
		{title && <h2 css={headingCls}>{title}</h2>}
		<div className={cx(styles, className)} style={style}>
			<img
				src="https://softr-prod.imgix.net/applications/d919d2ef-4bb1-4b91-aa55-6040ea8667e1/assets/3bc243e4-d5dc-4686-885d-6d8064811f93.png"
				alt="Accenture"
			/>
			<img
				src="https://softr-prod.imgix.net/applications/d919d2ef-4bb1-4b91-aa55-6040ea8667e1/assets/28af582d-3e20-4852-8ded-61ed8e263574.png"
				alt="Changeup"
			/>
			<img
				src="https://softr-prod.imgix.net/applications/d919d2ef-4bb1-4b91-aa55-6040ea8667e1/assets/db7b66d4-95f3-40bd-9ebe-7096bd702e33.png"
				alt="Decibio"
			/>
			<img
				src="https://softr-prod.imgix.net/applications/d919d2ef-4bb1-4b91-aa55-6040ea8667e1/assets/d2ab811e-e44e-4029-bc15-6bec9ad436f5.png"
				alt="HireCloud"
			/>
			<img
				src="https://softr-prod.imgix.net/applications/d919d2ef-4bb1-4b91-aa55-6040ea8667e1/assets/f87133c4-f57f-41e7-90f8-9940907030fe.png"
				alt="Rivalry"
			/>
		</div>
	</React.Fragment>
);

AppbaseUsers.propTypes = {
	/*eslint-disable */
	className: string,
	style: object,
	title: string,
	imageStyle: object,
	/* eslint-enable */
};

export default AppbaseUsers;
