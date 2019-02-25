import { css } from 'react-emotion';
import { mediaKey } from '../../utils/media';

const main = css`
	-webkit-font-smoothing: antialiased;
	text-rendering: optimizeLegibility;
	-moz-osx-font-smoothing: grayscale;
	-moz-font-feature-settings: 'liga' on;
	margin: 0 auto;
	max-width: 992px;
	> div {
		width: 100%;
		padding: 40px 0px 15px;
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
			font-size: 28px;
			margin-top: 28px;
			margin-bottom: 14px;
			max-width: 380px;
			word-spacing: 0.03rem;
		}
		.signup_description {
			h4 {
				margin-top: 14px;
				margin-bottom: 14px;
				line-height: 1.6;
				font-size: 18px;
				font-weight: 600;
				color: dodgerblue;
				max-width: 360px;
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
		padding: 0;

		.content {
			display: none;
		}
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

const footer = css`
	width: 100%;
	max-width: 800px;
	margin: 0px auto 30px;
	text-align: center;

	h2 {
		font-size: 17px;
		word-spacing: 0.04rem;
		font-weight: 600;
		color: #999;
		text-transform: uppercase;
	}

	img {
		max-width: 110px;
	}

	${mediaKey.large} {
		display: none;
	}
`;

export { main, footer };
