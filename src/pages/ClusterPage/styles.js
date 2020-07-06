import { css } from 'react-emotion';
import { media } from '../../utils/media';

const clusterContainer = css`
	.tag {
		background-color: #eee;
		color: #333;
		font-size: 13px;
		font-weight: 400;
		border-radius: 3px;
		padding: 2px 8px;
		margin: 0 12px;
		border: 1px solid #ccc;
	}
	.tag.top-right {
		margin-left: auto;
	}
	h2,
	h3 {
		font-size: 18px;
		font-weight: 600;
		color: #424242;
		margin: 15px 0;
		padding: 0 10px;
		line-height: 28px;
		letter-spacing: 0.02rem;
	}
	h3 {
		margin: 0 0 5px 0;
		padding: 0;
		font-size: 16px;
		line-height: 26px;
	}
	.region-container {
		display: flex;
		flex-direction: row;
		${media.ipadPro(css`
			justify-content: space-around;
		`)};
	}
	.region-list {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(270px, 300px));
		grid-gap: 10px;
		padding-left: 0;
		${media.small(css`
			width: 100%;
		`)};
		li {
			cursor: pointer;
			display: flex;
			flex-direction: row;
			height: 45px;
			align-items: center;
			padding: 8px;
			border: 1px solid #9196a1;
			border-radius: 3px;
			background-color: #fff;
			transition: all 0.3s ease;
			${media.small(css`
				width: 100%;
			`)};
			img {
				width: 40px;
				margin-right: 8px;
			}
			&:hover,
			&:focus {
				background-color: #fafafa;
			}
			&.active {
				border: 2px solid #4fee4f;
			}
			&.disabled {
				pointer-events: none;
				opacity: 0.2;
			}
		}
	}
`;

const clusterInfo = css`
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: space-between;
	.cluster-info__item {
		width: 49%;
		padding-bottom: 25px;
		div {
			font-size: 23px;
			font-weight: 300;
			color: #222;
			&:last-child {
				font-size: 13px;
				font-weight: 600;
				color: #999;
			}
		}
	}
	h3 {
		font-size: 16px;
		font-weight: 600;
		color: #666;
	}
	.price {
		font-size: 32px;
		font-weight: 400;
		color: #444;
	}
`;

const card = css`
	display: flex;
	flex-direction: row;
	width: 100%;
	height: auto;
	padding: 0;
	border-radius: 3px;
	margin-bottom: 30px;
	box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.05);
	background-color: #fff;
	.col {
		padding: 30px 25px;
		min-width: 270px;
		${media.ipadPro(css`
			width: 100%;
		`)};
		&.vcenter {
			display: flex;
			align-items: center;
		}
		&.full {
			width: 100%;
		}
		p {
			font-size: 14px;
		}
		input,
		select {
			max-width: 510px;
			height: 42px;
			padding: 5px 10px;
		}
		&.light {
			background-color: #eaf5ff;
			max-width: 270px;
		}
		&.grey {
			background-color: #f9f9f9;
			width: 300px;
			${media.ipadPro(css`
				display: flex;
				width: 100%;
				align-items: center;
				justify-content: space-between;
			`)};
			${media.small(css`
				flex-direction: column;
				align-items: flex-start;
			`)};
		}
		&.grow {
			flex-grow: 1;
		}
		&.expanded {
			padding: 55px 70px 0 55px;
			${media.ipadPro(css`
				padding: 40px 50px;
			`)};
		}
	}
	${media.ipadPro(css`
		flex-direction: column;
	`)};
`;

const settingsItem = css`
	display: flex;
	flex-direction: row;
	margin: 5px 0 15px;
	${media.xsmall(css`
		flex-direction: column;
	`)};
	h4 {
		width: 140px;
		text-align: right;
		margin: 8px 30px 0;
		font-weight: 600;
		font-size: 14px;
		${media.medium(css`
			text-align: left;
		`)};
		${media.xsmall(css`
			margin: 0;
		`)};
	}
	&.grow h4 {
		width: 240px;
	}
	select {
		max-width: 310px !important;
	}
	label {
		font-weight: 400;
		display: inline-flex;
		flex-direction: row;
		align-items: center;
		margin-right: 24px;
		input {
			position: relative;
			top: -1px;
			margin-right: 8px;
		}
	}
	.settings-label {
		${media.medium(css`
			display: flex;
			flex-direction: column;
		`)};
	}
`;

const clusterButtons = css`
	justify-content: space-between;
	text-align: right;
	margin-bottom: 40px;
	display: flex;
	${media.xsmall(css`
		flex-direction: column;
	`)} .delete {
		margin-bottom: 10px;
	}
`;

const clustersList = css`
	margin: 0;
	padding: 0;
	list-style: none;
	.cluster-card {
		padding: 30px 25px;
		border-radius: 3px;
		position: relative;
		margin-bottom: 30px;
		box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.05);
		background-color: #fff;
		h3 {
			margin-bottom: 15px;
		}
		.info-row {
			display: flex;
			flex-direction: row;
			margin-top: 20px;
			${media.medium(css`
				display: block;
			`)};
			& > div:first-child {
				flex: 1.5;
			}
			& > div {
				flex: 1;
				flex-direction: column;
				${media.medium(css`
					display: inline-block;
					padding: 10px;
					width: 33%;
				`)};
				${media.xsmall(css`
					padding: 10px;
					width: 45%;
				`)};
			}
			.region-info {
				display: flex;
				flex-direction: row;
				img {
					width: 40px;
					height: 21px;
					margin-right: 12px;
					${media.small(css`
						display: none;
					`)};
				}
				span {
					font-weight: 600;
				}
			}
			h4 {
				font-size: 13px;
				font-weight: 600;
				color: #999;
				margin-top: 0;
				text-transform: uppercase;
			}
		}
		&.compact {
			padding: 20px;

			h3 {
				height: 32px;
				display: flex;
				flex-direction: row;
				align-items: center;
			}

			.info-row {
				margin-top: 0;
			}

			.showOnHover {
				display: none;
			}

			&:hover,
			&:focus {
				.showOnHover {
					display: inline;
				}
			}
		}
	}
`;

const clusterEndpoint = css`
	display: flex;
	flex-direction: row;
	margin: 0px 0 35px;
	${media.small(css`
		flex-direction: column;
	`)}

	h4 {
		font-size: 16px;
		font-weight: 600;
		width: 180px;
		margin: 0;
		display: flex;
		flex-direction: column;
		align-items: start;
		& a {
			margin-top: 5px;
			font-size: 13px;
		}
		${media.small(css`
			margin-bottom: 10px;
		`)} i {
			font-size: 14px;
			margin-right: 10px;
		}
	}
`;

const credsBox = css`
	display: inline-flex;
	border-radius: 3px;
	border: 1px solid #d9d8e4;
	color: #555;
	height: 34px;
	.input {
		height: 100% !important;
		border-radius: 0;
		border: 0;
		min-width: 280px;
	}
	${media.small(css`
		flex-direction: column;
		justify-content: space-around;
	`)};
	.cred-text {
		${media.small(css`
			overflow-x: scroll;
		`)};
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
			border-left: 1px solid #d9d8e4;
			${media.small(css`
				border: 0;
			`)};
		}
		& > a {
			padding: 6px 12px;
		}
		span {
			border-left: 1px solid #d9d8e4;
			padding: 6px 12px;
		}
	}
`;

const invoiceTable = css`
	width: 100%;
	margin: 20px 20px 30px;
	tr {
		display: flex;
		flex-direction: row;
		border-bottom: 1px solid #eee;
		& > * {
			flex: 1;
			padding: 20px 10px;
		}
		&:first-child,
		&:last-child {
			border: 0;
		}
	}
`;

const esContainer = css`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	max-width: 200px;
	margin-right: 20px;
	min-width: 160px;
	p {
		padding: 5px;
		margin: 0;
		font-size: 15px;
		font-weight: 500;
	}
`;

export {
	clusterContainer,
	clusterInfo,
	card,
	settingsItem,
	clustersList,
	clusterEndpoint,
	credsBox,
	invoiceTable,
	esContainer,
	clusterButtons,
};
