import React from 'react';
import { css } from 'react-emotion';

const styles = css`
	width: 100%;
	height: 400px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

const Loader = () => (
	<div className={styles}>
		<img src="/static/images/loader.svg" alt="loading" />
	</div>
);

export default Loader;
