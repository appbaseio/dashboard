import React, { Component } from 'react';
import {
 notification, Card, Alert, DatePicker, Table,
} from 'antd';
import { css } from 'emotion';
import moment from 'moment';

import { getClusterInvoice } from '../utils';

const flex = css`
	display: flex;
	align-items: Center;
	justify-content: space-between;
`;

const { RangePicker } = DatePicker;

function disabledDate(current) {
	return moment().isBefore(current);
}

export default class InvoiceScreen extends Component {
	constructor(props) {
		super(props);

		this.state = {
			invoice: [],
			isLoading: true,
			filteredInvoice: [],
		};
	}

	componentDidMount() {
		getClusterInvoice(this.props.clusterId)
			.then(data => this.setState(() => {
					// prettier-ignore
					const invoice = data && data.invoice_breakdown
							? data.invoice_breakdown.map(item => ({
									...item,
									from: item.from * 1000,
									to: item.to * 1000,
									consumption: item.hours,
							}))	: [];
					return {
						isLoading: false,
						invoice,
						filteredInvoice: invoice,
					};
				}))
			.catch((e) => {
				notification.error({
					message: 'Error occured while fetching the data. Please try again.',
				});
				console.error(e);
				this.setState({
					isLoading: false,
				});
			});
	}

	handleFilter = (dateArray, dateString) => {
		if (dateArray.length) {
			const startDate = new Date(dateString[0]).getTime();
			const endDate = new Date(dateString[1]).getTime();
			const { invoice } = this.state;
			const filteredData = invoice.filter((item) => {
				// prettier-ignore
				const isInRange = (moment(item.from).isSame(startDate, 'date')
						|| moment(item.from).isAfter(moment(startDate)))
					&& (moment(item.to).isSame(endDate, 'date') || moment(item.to).isBefore(endDate));
				return isInRange;
			});
			this.setState({
				filteredInvoice: filteredData,
			});
		} else {
			this.setState(state => ({
				filteredInvoice: state.invoice,
			}));
		}
	};

	render() {
		const { isLoading, filteredInvoice } = this.state;

		const columns = [
			{
				title: 'From',
				dataIndex: 'from',
				key: 'from',
				render: date => moment(date).format('MMMM Do YYYY, h:mm:ss a'),
			},
			{
				title: 'Till',
				dataIndex: 'to',
				key: 'to',
				render: date => moment(date).format('MMMM Do YYYY, h:mm:ss a'),
			},
			{
				title: 'Consumption (in hours)',
				dataIndex: 'consumption',
				key: 'consumption',
			},
			{
				title: 'Cost (in dollars)',
				dataIndex: 'cost',
				key: 'cost',
				render: cost => cost.toFixed(2),
			},
		];

		return (
			<div>
				<Card
					title={(
<div className={flex}>
							<span>Usage</span>

							<RangePicker disabledDate={disabledDate} onChange={this.handleFilter} />
</div>
)}
				>
					<Table
						rowKey={data => data.from}
						bordered
						loading={isLoading}
						dataSource={filteredInvoice}
						columns={columns}
					/>
				</Card>
			</div>
		);
	}
}
