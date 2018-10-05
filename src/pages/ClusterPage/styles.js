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
		margin: 0;
		padding: 0;
		width: 270px;
		list-style: none;
		li {
			cursor: pointer;
			width: 240px;
			height: 46px;
			display: flex;
			flex-direction: row;
			align-items: center;
			padding: 8px;
			border: 1px solid #9196a1;
			border-radius: 3px;
			margin-bottom: 12px;
			background-color: #fff;
			transition: all 0.3s ease;
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
			width:100%;
		`)};
		&.vcenter {
			display: flex;
			align-items: center;
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
		}
		&.grey {
			background-color: #f9f9f9;
			width:300px;
			${media.ipadPro(css`
				display: flex;
				width: 100%;
				align-items: center;
				justify-content: space-between;
			`)};
		}
		&.grow {
			flex-grow: 1;
		}
		&.pricing{
			padding: 55px 70px 0 55px;
			${media.ipadPro(css`
				padding: 40px 50px;
			`)};
		}
	}
	${media.ipadPro(css`
		flex-direction:column;
	`)};
`;

const settingsItem = css`
	display: flex;
	flex-direction: row;
	margin: 5px 0 15px;
	h4 {
		width: 140px;
		text-align: right;
		margin: 15px 30px 0;
		font-weight: 600;
		font-size: 14px;
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
`;

const clustersList = css`
	margin: 0;
	padding: 0;
	list-style: none;
	.cluster-card {
		padding: 30px 25px;
		border-radius: 3px;
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
			& > div {
				flex: 1;
				flex-direction: column;
			}
			.region-info {
				display: flex;
				flex-direction: row;
				img {
					width: 40px;
					height: 21px;
					margin-right: 12px;
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
			.info-row {
				margin-top: 0;
			}
		}
	}
`;

const clusterEndpoint = css`
	display: flex;
	flex-direction: row;
	margin: 12px 0 25px;
	h4 {
		color: #326bdc;
		font-size: 16px;
		font-weight: 600;
		width: 180px;
		margin: 0;
		display: flex;
		align-items: center;
		i {
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

export {
	clusterContainer,
	clusterInfo,
	card,
	settingsItem,
	clustersList,
	clusterEndpoint,
	credsBox,
	invoiceTable,
};
