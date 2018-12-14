import { css } from 'react-emotion';
import { media } from '../../utils/media';

const header = css`
	display: flex;
	flex-direction: row;
	align-items: center;
	height: 60px;
	width: 100%;
	padding: 0 25px;
	background-color: #fff;
	overflow: hidden;
	box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.15);
	z-index: 999;
	position: relative;
	justify-content: space-between;

	.options {
		${media.small(css`
			display: none;
		`)};
	}

	.row {
		display: flex;
		flex-grow: 1;
		flex-direction: row;
		align-items: center;
	}

	ul {
		flex-grow: 1;
		line-height: 56px;
		border: 0;
		margin: 0 30px;
		letter-spacing: 0.03rem;
		text-transform: uppercase;
		font-size: 13px;
	}
`;

export default header;
