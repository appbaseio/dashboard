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

const headingText = css`
	margin-bottom: 0;
	margin-top: 0.5em;
	justify-content: center;
	font-weight: 700;
	text-transform: uppercase;
	font-size: 13px;
	color: #999;
	letter-spacing: 0.012rem;
`;

const statsText = css`
	margin-bottom: 0;
	font-weight: 300;
`;

export {
 statsText, headingText, modalHeading, radiobtn, input, pricebtn, clusterInfo,
};
