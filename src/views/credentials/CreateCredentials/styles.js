import { css } from 'emotion';

export default {
	formLabel: css`
		font-weight: 500;
		color: black;
		font-size: 14px;
	`,
	subHeader: css`
		margin-left: 10px;
		font-weight: 100;
		font-size: 14px;
	`,
	addedWhiteList: css`
		background-color: #fbfcfe;
		border: solid 1px #83a2ee;
		border-radius: 2px;
		padding: 5px 10px;
		color: #343e54;
		margin-bottom: 15px;
		width: 100%;
	`,
	description: css`
		font-size: 12px,
		font-weight: 100;
	`,
	serachResultsCls: css`
		border: solid 1px #d9d9d9;
		border-top: none;
		border-radius: 3px;
		position: absolute;
		width: 100%;
		background-color: #fff;
		z-index: 1;
	`,
	error: css`
		color: red;
		font-size: 12px;
		padding: 5px;
	`,
};
