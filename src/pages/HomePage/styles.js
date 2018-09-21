import { css } from 'emotion';

const modalHeading = css`
	font-weight: 700;
	color: #555;
	font-size: 14px;
	line-height: 24px;
	margin: 24px 0 8px 0;
`;

const input = css`
	padding: 15px 10px;
`;

const radiobtn = css`
	margin-right: 20px;
`;

const pricebtn = css`
	display: flex !important;
	align-items: center;
	padding: 10px 6px 10px 12px;
	border-radius: 4px;
	margin-bottom: 10px;
	border: 1px solid #d9d9d9;
	width: 100% !important;

	span:nth-child(2) {
		flex-grow: 1 !important;
	}
`;

const clusterInfo = css`
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-radius: 4px;
	background: rgba(24, 144, 255, 0.2);
	padding: 10px;
	border: solid 1px rgba(24, 144, 255);
`;

const cardActions = css`
	position: relative;
	overflow: hidden;
	padding: 25px auto;
	.card-actions {
		width: calc(100% - 20px);
		position: absolute;
		bottom: -50%;
		background: #fafafa;
		border: 1px solid #e8e8e8;
		z-index: -1;
		opacity: 0;
		transition: all ease 0.2s;
	}
	&:hover {
		.card-actions {
			bottom: 20px;
			z-index: 2;
			opacity: 1;
		}
	}
`;

const columnSeparator = css`
	text-align: center;
	font-size: 12px;
	flex-grow: 1;
	text-transform: capitalize;
	border-right: 1px solid #e8e8e8;
	cursor: pointer;
	padding: 10px;
	transition: all ease 0.2s;
	&:hover {
		background: #ececec;
		color: #1890ff;
	}
`;

const deleteButton = css`
	${columnSeparator};
	color: tomato;
	border: 0;
	&:hover {
		color: red;
	}
`;

const actionIcon = css`
	margin-right: 5px;
`;

export {
	modalHeading,
	radiobtn,
	input,
	pricebtn,
	clusterInfo,
	columnSeparator,
	actionIcon,
	deleteButton,
	cardActions,
};
