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
					const invoice = data.invoice_breakdown.map(item => ({
						...item,
						from: item.from * 1000,
						to: item.to * 1000,
						consumption: (item.to - item.from) / 3600,
					}));
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

	handleFilter = (_, dateString) => {
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
	};

	render() {
		const { isTrial } = this.props;
		const { isLoading, filteredInvoice } = this.state;

		if (isTrial) {
			return (
				<div>
					<Card title="Invoice">
						<Alert
							description="The usage view is only accessible for paid subscriptions."
							type="info"
							showIcon
						/>
					</Card>
				</div>
			);
		}

		const columns = [
			{
				title: 'Invoice From',
				dataIndex: 'from',
				key: 'from',
				render: date => new Date(date).toLocaleDateString(),
			},
			{
				title: 'Invoice till',
				dataIndex: 'to',
				key: 'to',
				render: date => new Date(date).toLocaleDateString(),
			},
			{
				title: 'Consumption (in hours)',
				dataIndex: 'consumption',
				key: 'consumption',
				render: consumption => consumption.toFixed(2),
			},
			{
				title: 'Cost (in dollars)',
				dataIndex: 'cost',
				key: 'cost',
			},
		];

		return (
			<div>
				<Card
					title={(
<div className={flex}>
							<span>Invoice</span>

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
