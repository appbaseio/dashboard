import React from 'react';

const Loader = ({ show, label }) => {
	if (!show) return null;

	return (
		<div className="loader">
			<p>{label}</p>
		</div>
	);
};

export default Loader;
