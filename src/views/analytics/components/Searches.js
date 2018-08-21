import React from 'react';
import { Card, Table, Button } from 'antd';
import { defaultColumns } from './../utils';

const Searches = ({
 title, dataSource, columns, showViewOption, onClick, plan, pagination,
}) => (
	<Card title={title}>
		<Table
			rowKey={record => record.key}
			dataSource={dataSource}
			columns={columns || defaultColumns(plan)}
			pagination={pagination}
		/>
		{showViewOption && (
			<Button onClick={() => onClick()} css="width: 100%;height: 50px;margin-top: 10px;">
				VIEW ALL
			</Button>
		)}
	</Card>
);

Searches.defaultProps = {
	showViewOption: true,
	pagination: false,
};

export default Searches;
