import { css } from 'emotion';
const backgroundUrlImage = require('../../../static/images/Herobg.png');

export const deployClusterStyles = css`
	padding: 20px;
	background-image: url(${backgroundUrlImage});
	height: 100vh;

	.title-container {
		font-size: 15px;
		margin-bottom: 5px;
	}

	.input-container {
		width: 60%;
	}

	.validate-button {
		margin-left: 20px;
	}

	.deploy-button {
		color: #fff;
		background: linear-gradient(
			88.68deg,
			rgba(53, 118, 254, 0.8) -2.85%,
			rgba(255, 0, 102, 0.8) 115.91%
		);
		height: 40px;
		width: 150px;
		margin-left: 20px;

		&:hover,
		&:focus {
			transition: 0.4s linear;
			background: rgb(64, 51, 104);
			color: #fff;
		}
	}
`;
