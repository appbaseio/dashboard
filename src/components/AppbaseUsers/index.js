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
		max-width: 30%;
		margin: 10px;
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
	fontWeight: 500,
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
			<img src="/static/images/testimonials/aerial.png" alt="Aerial" />
			<img src="/static/images/testimonials/helium.png" alt="Helium" />
			<img src="/static/images/testimonials/inquisit.png" alt="Inquisit" />
			<img src="/static/images/testimonials/lyearn.png" alt="Lyearn" />
			<img src="/static/images/testimonials/shopelect.png" alt="Shopelect" />
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
