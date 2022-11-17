import { css } from 'react-emotion';

const backgroundUrlImage = require('../../../static/images/Herobg.png');

const container = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: 100vh;
	background-image: url(${backgroundUrlImage});
	filter: drop-shadow(0px 4px 60px rgba(0, 0, 0, 0.2));
`;

const card = css`
	width: 90%;
	max-width: 450px;
	display: flex;
	flex-direction: column;
	text-align: center;
	border-radius: 4px;
	padding: 20px;
	background: none !important;
	box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.15);
	filter: drop-shadow(0px 4px 60px rgba(0, 0, 0, 0.2));
	.ant-input {
		border: none;
		background: #f4f4f4;
	}
	.ant-card {
		background: none !important;
		padding: 0px;
	}
	.ant-card-body {
		padding: 24px;
	}
	h2 {
		font-weight: 400;
		color: #424242;
		font-size: 24px;
		margin-bottom: 25px;
	}

	a {
		margin: 4px 0;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		letter-spacing: 0.02rem;
		font-size: 15px;
		font-weight: 700;
		cursor: pointer;
		line-height: 2.45;
		height: 50px;
		border-radius: 6px;

		i {
			font-size: 18px;
			position: relative;
			top: 1px;
		}
	}
`;

const emailBtn = css`
	margin: 4px 0;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	letter-spacing: 0.02rem;
	font-size: 15px;
	font-weight: 700;
	cursor: pointer;
	line-height: 2.45;
	height: 50px;
	border-radius: 6px;

	i {
		font-size: 18px;
		position: relative;
		top: 1px;
	}
`;

const inputStyles = css`
	margin: 5px 0;
	letter-spacing: 0.02rem;
	font-size: 15px;
`;

const githubBtn = css`
	color: #fff;
	background: rgb(22, 23, 26);
	border: 0;
	&:hover,
	&:focus {
		background-color: #333;
		color: #fff;
		border-color: #666;
	}
`;

const googleBtn = css`
	color: #fff;
	background-color: rgb(234, 67, 53);
	border: 0;
	&:hover,
	&:focus {
		background-color: rgb(245, 106, 94);
		color: #fff;
		border-color: #f7d2cf;
	}
`;

const gitlabBtn = css`
	color: #fff;
	background-color: rgb(85, 68, 136);
	border: 0;
	&:hover,
	&:focus {
		background-color: rgb(64, 51, 104);
		color: #fff;
		border-color: #473281;
	}
`;

export {
	container,
	card,
	githubBtn,
	googleBtn,
	gitlabBtn,
	emailBtn,
	inputStyles,
};
