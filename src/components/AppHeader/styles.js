import { css } from 'react-emotion';

const header = css`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	height: 60px;
	padding: 0 25px 0 0;
	background-color: #fff;
	overflow: hidden;
	box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.15);
	z-index: 999;
	position: fixed;
	top: 0px;
	width: calc(100% - 260px);

	ul {
		line-height: 56px;
		border: 0;
		margin: 0 30px;
		letter-spacing: 0.01rem;
		font-size: 13px;
	}
`;

export default header;
