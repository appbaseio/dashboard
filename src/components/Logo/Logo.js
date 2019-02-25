import React from 'react';
import { number } from 'prop-types';

const Logo = ({ type, width }) => {
	switch (type) {
		case 'white':
			return <img src="/static/images/appbase_white.svg" width={width} alt="appbase.io" />;
		case 'small':
			return <img src="/static/images/appbase_small.svg" width={width} alt="appbase.io" />;
		case 'black':
			return <img src="/static/images/appbase_black.svg" width={width} alt="appbase.io" />;
		default:
			return <img src="/static/images/appbase.svg" width={width} alt="appbase.io" />;
	}
};

Logo.defaultProps = {
	width: 140,
};

Logo.propTypes = {
	width: number,
};

export default Logo;
