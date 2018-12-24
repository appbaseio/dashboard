import React from 'react'; // eslint-disable-line
import styled from 'react-emotion';

const Overlay = styled('div')`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	min-height: 100vh;
	height: 100%;
	overflow: hidden;
	background-color: rgba(0, 0, 0, 0.6);
	z-index: 1000;
`;

export default Overlay;
