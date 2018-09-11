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
	fieldBadge: css`
		margin-left: 2px;
		font-size: 10px;
		background-color: #a2a4aa;
		border-radius: 3px;
		padding: 1px 2px;
		color: #fff;
	`,
	overlay: css`
		position: absolute;
		top: 160px;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(255, 255, 255, 0.8);
		z-index: 9999;
		color: black;
	`,
	upgradePlan: css`
		margin-top: 200px;
		font-size: 16px;
		font-weight: 500;
		text-align: center;
	`,
};
