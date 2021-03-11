import { css } from 'react-emotion';

const checkbox = css`
	margin-left: 8px;
	text-align: left;
	margin-bottom: 12px;
	display: flex;

	.ant-checkbox {
		margin-top: 5px;
		height: 16px;
	}
`;

const main = css`
	min-height: 100vh;
	margin: 0 auto;
	max-width: 992px;
	> div {
		width: 100%;
		padding: 50px 0px;
	}
	a {
		height: auto;
		display: inline';
	}
	.content {
		margin-right: 100px;
		.title {
			line-height: 1.8em;
			font-weight: 500;
			font-size: 30px;
			margin-top: 28px;
			margin-bottom: 14px;
			max-width: 350px;
		}
		p {
			margin: 0 0 14px;
			line-height: 1.8em;
		}
		.signup_description {
			h4 {
				margin-top: 14px;
				margin-bottom: 14px;
				line-height: 1.5;
				color: rgba(0, 0, 0, 0.86);
				font-size: 16px;
				text-transform: uppercase;
			}
			.signup_benefits {
				padding-left: 0;
				margin-bottom: 14px 0;
				.icon {
					color: blue;
					padding-right: 10px;
				}
				li {
					list-style: none;
					margin: 15px 0;
				}
			}
		}
	}
`;

export { checkbox, main }; // eslint-disable-line
