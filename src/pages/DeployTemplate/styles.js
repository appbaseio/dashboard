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
		height: 40px;
		width: 150px;
		margin-left: 20px;
	}

	.error-alert-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
`;

export const popoverContent = css`
	overflow-y: auto;
	overflow-x: auto;
	word-wrap: break-word;
	max-width: 300px;
	max-height: 300px;
`;
