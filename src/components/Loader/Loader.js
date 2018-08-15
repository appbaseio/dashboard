import React from 'react';
import { Spin } from 'antd';
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
		<Spin size="large" />
	</div>
);

export default Loader;
