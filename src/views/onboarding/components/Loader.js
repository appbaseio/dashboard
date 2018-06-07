import React from 'react';

export default props => {
	if (!props.show) return null;

	return (
		<div className="loader">
			<p>{props.label}</p>
		</div>
	);
};
