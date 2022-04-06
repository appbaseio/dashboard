import React from 'react';
import PropTypes from 'prop-types';

const JsonView = ({ json }) => {
	return (
		<pre css={{ margin: 0 }}>
			{JSON.stringify(json, null, 4) !== '{}'
				? JSON.stringify(json, null, 4)
				: `{ error: Failed to fetch }`}
		</pre>
	);
};

JsonView.propTypes = {
	json: PropTypes.object,
};

JsonView.defaultProps = {
	json: {},
};

export default JsonView;
