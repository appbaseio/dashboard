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
		<img src="/static/images/loader.svg" alt="loading" />
	</div>
);

export default Loader;
