import React from 'react';
import { number } from 'prop-types';

const ReactivesearchLogo = ({ type, width }) => {
	switch (type) {
		case 'white':
			return (
				<img
					src="/static/images/reactivesearch_white.svg"
					width={width}
					alt="reactivesearch.io"
				/>
			);
		case 'color':
			return (
				<img
					src="/static/images/reactivesearch_color.svg"
					width={width}
					alt="reactivesearch.io"
				/>
			);
		case 'black':
			return (
				<img
					src="/static/images/reactivesearch_black.svg"
					width={width}
					alt="reactivesearch.io"
				/>
			);
		default:
			return (
				<img
					src="/static/images/reactivesearch_grey.svg"
					width={width}
					alt="reactivesearch.io"
				/>
			);
	}
};

ReactivesearchLogo.defaultProps = {
	width: 140,
};

ReactivesearchLogo.propTypes = {
	width: number,
};

export default ReactivesearchLogo;
