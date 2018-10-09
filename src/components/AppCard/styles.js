import { css } from 'emotion';

import { mediaKey } from '../../utils/media';

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

const cardActions = css`
	position: relative;
	overflow: hidden;
	padding: 25px auto;
	max-height: 205px;
	${mediaKey.xsmall} {
		max-height: none;
	}

	.card-actions {
		width: calc(100% - 20px);
		position: absolute;
		left: 0;
		width: 100%;
		bottom: -50%;
		background: #fafafa;
		border-top: 1px solid #e8e8e8;
		z-index: -1;
		opacity: 0;
		transition: all ease 0.2s;

		${mediaKey.medium} {
			bottom: 0;
			z-index: 2;
			opacity: 1;

			i {
				display: none;
			}
		}
	}

	&:hover {
		.card-actions {
			bottom: 0;
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

	${mediaKey.xsmall} {
		padding: 10px 0;
	}

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

const statsContainer = css`
	${mediaKey.xsmall} {
		width: 100%;
		text-align: center;
	}
`;

const actionIcon = css`
	margin-right: 5px;
`;

const skeleton = css`
	max-height: 205px;
	${mediaKey.xsmall} {
		max-height: none;
	}
`;

export {
	statsText,
	headingText,
	cardActions,
	columnSeparator,
	deleteButton,
	actionIcon,
	statsContainer,
	skeleton,
};
