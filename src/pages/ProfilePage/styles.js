import { css } from 'react-emotion';
import { media } from '../../utils/media';

const credsBox = css`
	display: inline-flex;
	border-radius: 3px;
	border: 1px solid #d9d8e4;
	color: #555;
	${media.small(css`
		flex-direction: column;
		overflow: hidden;
		width: 100%;
		justify-content: space-around;
	`)};
	.cred-text {
		${media.small(css`
			overflow-x: scroll;
		`)};
	}
	.cred-button > span {
		border-left: 1px solid #d9d8e4;
		box-sizing: border-box;
		height: 100%;
		justify-content: center;
		align-items: center;
		display: flex;
	}
	.cred-button a {
		${media.small(css`
			width: 50%;
			border-top: 1px solid #efefef;
			border-right: 1px solid #efefef;
		`)};
		&:last-child {
			${media.small(css`
				border-right: 0;
			`)};
		}
		.cred-button-text {
			display: none;
			${media.small(css`
				border: 0;
				display: inline;
			`)};
		}
	}
	a {
		cursor: pointer;
	}
	& > span {
		padding: 6px 12px;
		text-align: center;
		display: inline-flex;
		align-items: center;
		a {
			color: #888;
			transition: all 0.3s ease;
			&:hover,
			&:focus {
				color: #666;
			}
		}
		&:last-child {
			padding: 0;
			${media.small(css`
				border: 0;
			`)};
		}
		& > a {
			padding: 6px 12px;
		}
		span {
			padding: 6px 12px;
		}
	}
`;

export default credsBox;
