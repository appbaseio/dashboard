import { css } from 'emotion';

const label = css`
  padding: 5px;
  padding-left: 0;
  margin-top: 10px;
`;

const input = css`
  padding: 15px 10px;
`;

const radiobtn = css`
  margin-right: 20px;
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
 statsText, headingText, label, radiobtn, input,
};
