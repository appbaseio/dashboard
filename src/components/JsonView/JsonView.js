import React from 'react';
import PropTypes from 'prop-types';

const JsonView = ({ json }) => (
	<pre css={{ margin: 0 }}>{JSON.stringify(json, null, 4)}</pre>
);

JsonView.propTypes = {
	json: PropTypes.object,
};

JsonView.defaultProps = {
	json: {},
};

export default JsonView;
