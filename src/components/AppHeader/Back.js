import React from 'react';
import { Icon } from 'antd';
import { Link } from 'react-router-dom';
import { string } from 'prop-types';

const Back = ({ url }) => (
	<Link to={url}>
		<Icon type="arrow-left" />
	</Link>
);

Back.propTypes = {
	url: string.isRequired,
};

export default Back;
