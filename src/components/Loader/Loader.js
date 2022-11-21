import React from 'react';
import { css } from 'react-emotion';

const styles = css`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
`;

const Loader = () => (
	<div className={styles}>
		<object
			data="/static/images/reactivesearch_loader.svg"
			type="image/svg+xml"
		>
			<img src="/static/images/reactivesearch_loader.svg" alt="loading" />
		</object>
	</div>
);

export default Loader;
