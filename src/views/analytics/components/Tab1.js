import React from 'react';
import { Spin, Icon, Card } from 'antd';
import { LineChart, XAxis, Tooltip, CartesianGrid, Line, YAxis } from 'recharts';
import PropTypes from 'prop-types';
import Flex from './../../../shared/Flex';
import Searches from './Searches';

const normalizeData = (data = []) =>
	data.map((o) => {
		const newData = o;
		const date = new Date(o.key_as_string);
		newData.formatDate = `${date.getMonth()}/${date.getDate()}`;
		return newData;
	});
const addKeys = (data = []) =>
	data.map((d, index) => {
		const v = d;
		v.key = index;
		return v;
	});
class Tab1 extends React.Component {
	handleViewMore = () => {
		console.log(this.props);
	};
	render() {
		if (this.props.loading) {
			const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
			return <Spin indicator={antIcon} />;
		}
		const { noResults, popularSearches, searchVolume } = this.props;
		return (
			<React.Fragment>
				<Card title="Daily Search Volume">
					<LineChart
						width={1000}
						height={300}
						data={normalizeData(searchVolume)}
						margin={{
							top: 5,
							right: 20,
							left: 10,
							bottom: 5,
						}}
					>
						<XAxis dataKey="formatDate" />
						<YAxis dataKey="count" />
						<Tooltip />
						<CartesianGrid stroke="#f5f5f5" />
						<Line type="monotone" dataKey="count" stroke="#ff7300" />
					</LineChart>
				</Card>
				<Flex css="width: 100%;margin-top: 20px">
					<div css="flex: 50%;margin-right: 10px">
						<Searches dataSource={addKeys(popularSearches)} title="Popular Searches" />
					</div>
					<div css="flex: 50%;margin-left: 10px">
						<Searches dataSource={addKeys(noResults)} title="No Result Searches" />
					</div>
				</Flex>
			</React.Fragment>
		);
	}
}
Tab1.propTypes = {
	noResults: PropTypes.array,
	popularSearches: PropTypes.array,
	searchVolume: PropTypes.array,
};

export default Tab1;
