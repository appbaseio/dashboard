import { css } from 'react-emotion';

const container = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: 100vh;
	background-image: linear-gradient(120deg, #eef5ff 0%, #c2e9fb 100%);
`;

const card = css`
	width: 450px;
	display: flex;
	flex-direction: column;
	text-align: center;
	border-radius: 4px;
	margin-top: 25px;
	padding: 20px;
	box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.15);

	h2 {
		font-weight: 400;
		color: #424242;
		font-size: 24px;
		margin-bottom: 25px;
	}

	button {
		margin: 4px 0;
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

const githubBtn = css`
	color: #fff;
	background: rgb(22, 23, 26);

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

	&:hover,
	&:focus {
		background-color: #e80029;
		color: #fff;
		border-color: #f7d2cf;
	}
`;

export {
 container, card, githubBtn, googleBtn,
};
