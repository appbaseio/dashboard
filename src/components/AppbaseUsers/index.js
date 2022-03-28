import React from 'react';
import { css, cx } from 'react-emotion';
import { string, object } from 'prop-types';
import { media, mediaKey } from '../../utils/media';

const styles = css`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
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
	color: '#323131',
	[mediaKey.medium]: {
		fontSize: '1.375rem',
	},
});

const AppbaseUsers = ({ className, style, title }) => (
	<React.Fragment>
		{title && <h2 css={headingCls}>{title}</h2>}
		<div className={cx(styles, className)} style={style}>
			<img
				src="/static/images/testimonials/accenture.png"
				alt="Accenture"
			/>
			<img
				src="/static/images/testimonials/changeup.png"
				alt="Changeup"
			/>
			<img src="/static/images/testimonials/decibio.png" alt="Decibio" />
			<img
				src="/static/images/testimonials/hirecloud.png"
				alt="HireCloud"
			/>
			<img src="/static/images/testimonials/rivalry.png" alt="Rivalry" />
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
