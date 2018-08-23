import React from 'react';

const Container = ({ children, ...props }) => (
	<div
		css={{
			width: '100%',
			maxWidth: 1300,
			margin: '0 auto',
			padding: '45px 20px',
		}}
		{...props}
	>
		{children}
	</div>
);

export default Container;
