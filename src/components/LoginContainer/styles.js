import { css } from 'react-emotion';
import { mediaKey } from '../../utils/media';

const main = css`
	-webkit-font-smoothing: antialiased;
	text-rendering: optimizeLegibility;
	-moz-osx-font-smoothing: grayscale;
	-moz-font-feature-settings: 'liga' on;
	min-height: 100vh;
	margin: 0 auto;
	max-width: 992px;
	> div {
		width: 100%;
		padding: 50px 0px;
	}
	.content {
		margin-right: 100px;
		mark {
			background-color: dodgerblue;
			color: #fff;
		}
		.highlight {
			color: yellow;
		}
		.title {
			line-height: 1.9em;
			font-weight: 600;
			font-size: 30px;
			margin-top: 28px;
			margin-bottom: 14px;
			max-width: 360px;
			word-spacing: 0.03rem;
		}
		p {
			margin: 0 0 14px;
			line-height: 1.6em;
			margin: 10px 0 20px;
			font-size: 18px;
		}
		.signup_description {
			h4 {
				margin-top: 14px;
				margin-bottom: 14px;
				line-height: 1.5;
				font-size: 16px;
				font-weight: 600;
				color: dodgerblue;
				text-transform: uppercase;
			}
			.signup_benefits {
				padding-left: 0;
				margin-bottom: 14px 0;
				display: flex;
				flex-direction: column;
				.icon {
					background-color: lightblue;
					color: dodgerblue;
					display: flex;
					justify-content: center;
					align-items: center;
					width: 24px;
					height: 24px;
					border-radius: 50%;
				}
				li {
					list-style: none;
					margin: 15px 0;
					display: flex;
					flex-direction: row;
					justify-content: space-between;

					span {
						width: calc(100% - 40px);
						display: block;
						font-size: 16px;
					}
				}
			}
		}
	}
	${mediaKey.large} {
		padding: 20px;
	}
	${mediaKey.medium} {
		flex-direction: column-reverse;
		justify-content: center;
		> div {
			justify-content: center;
			align-items: center;
			padding: 20px 0px;
		}
		.content {
			.title {
				max-width: 100%;
			}
		}
	}
`;

export { main }; // eslint-disable-line
