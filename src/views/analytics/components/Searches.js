import React from 'react';
import { Card, Table, Button } from 'antd';

// const dataSource = [
// 	{
// 		key: '1',
// 		term: 'NPM',
// 		count: 32,
// 	},
// 	{
// 		key: '2',
// 		term: '2-228',
// 		count: 42,
// 	},
// 	{
// 		key: '3',
// 		term: 'PM',
// 		count: 42,
// 	},
// ];

const columns = [
	{
		title: 'Search Terms',
		dataIndex: 'term',
		key: 'term',
	},
	{
		title: 'Total Queries',
		dataIndex: 'count',
		key: 'count',
	},
];

const Searches = ({ title, dataSource }) => (
	<Card title={title}>
		<Table dataSource={dataSource} columns={columns} pagination={false} />
		<Button css="width: 100%;height: 50px;margin-top: 10px;">VIEW ALL</Button>
	</Card>
);

export default Searches;
