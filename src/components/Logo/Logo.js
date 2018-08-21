import React from 'react';
import { number } from 'prop-types';

const Logo = ({ width }) => <img src="/static/images/appbase.svg" width={width} alt="appbase.io" />;

Logo.defaultProps = {
	width: 140,
};

Logo.propTypes = {
	width: number,
};

export default Logo;
