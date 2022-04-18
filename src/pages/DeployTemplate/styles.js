import { css } from 'emotion';

export const mainContainer = css`
	padding: 20px;
	height: 100vh;
	background-repeat: no-repeat;
	background-size: cover;

	.tab-container {
		padding: 20px;
	}
`;

export const deployClusterStyles = css`
	.title-container {
		font-size: 15px;
		margin-bottom: 5px;
	}

	.input-container {
		width: 60%;
	}

	.dropdown-container {
		width: 400px;
		margin-top: 10px;
	}

	.deploy-cluster-option-chooser {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 30px;
	}

	.success-alert {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.choose-cluster {
		display: flex;
		flex-direction: column;
	}

	.cluster-view-button {
		cursor: pointer;
		color: #18a0fb;
	}

	.validate-button {
		margin-left: 20px;
	}

	.deploy-button {
		height: 40px;
		width: 150px;
		margin: 20px 0px 0px 20px;
	}

	.create-cluster-button {
		height: 40px;
		width: 275px;
	}

	.error-alert-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.card-title-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.ant-card-body {
		background: #fafafa;
		padding: 0px;
	}
`;

export const popoverContent = css`
	overflow-y: auto;
	overflow-x: auto;
	word-wrap: break-word;
	max-width: 300px;
	max-height: 300px;
`;

export const editorContainer = css`
	overflow: scroll;

	.log-line {
		display: flex;
		line-height: 30px;
		&: hover {
			background-color: #eaeaea;
		}
	}

	.log-component {
		margin-left: 15px;
	}

	.width {
		width: 70px;
	}

	.bg-warning {
		background-color: #ffefcf;
		&: hover {
			background-color: #ffdf9e;
		}
	}

	.bg-error {
		background-color: #f7d4d6;
		&: hover {
			background-color: #efa9ac;
		}
	}
`;
