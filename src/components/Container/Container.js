import React from 'react';

const Container = ({ children, isFreeUser, ...props }) => (
	<div
		css={{
			width: '100%',
			maxWidth: 1300,
			margin: '0 auto',
			padding: isFreeUser ? '0px 20px 20px' : '45px 20px',
		}}
		{...props}
	>
		{children}
	</div>
);

export default Container;
