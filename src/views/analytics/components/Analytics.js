import React from 'react';
import { Spin, Icon, Card } from 'antd';
import { LineChart, XAxis, Tooltip, CartesianGrid, Line, YAxis } from 'recharts';
import PropTypes from 'prop-types';
import Flex from './../../../shared/Flex';
import { popularFiltersCol, popularResultsCol } from './../utils';
import Searches from './Searches';

const normalizeData = (data = []) =>
	data.map((o) => {
		const newData = o;
		const date = new Date(o.key_as_string);
		newData.formatDate = `${date.getMonth() + 1}/${date.getDate()}`;
		return newData;
	});
class Analytics extends React.Component {
	handleViewMore = () => {
		console.log(this.props);
	};
	render() {
		if (this.props.loading) {
			const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
			return <Spin indicator={antIcon} />;
		}
		const {
			noResults,
			popularSearches,
			searchVolume,
			popularFilters,
			popularResults,
			plan,
		} = this.props;
		return (
			<React.Fragment>
				<Card title="Daily Search Volume">
					<LineChart
						width={window.innerWidth - 300}
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
						<Searches
							onClick={() => this.props.redirectTo('popularSearches')}
							dataSource={popularSearches}
							title="Popular Searches"
						/>
					</div>
					<div css="flex: 50%;margin-left: 10px">
						<Searches
							onClick={() => this.props.redirectTo('noResultSearches')}
							dataSource={noResults}
							title="No Result Searches"
						/>
					</div>
				</Flex>
				{plan === 'growth' && (
					<Flex css="width: 100%;margin-top: 50px">
						<div css="flex: 50%;margin-right: 10px">
							<Searches
								dataSource={popularResults}
								columns={popularResultsCol}
								title="Popular Results"
								onClick={() => this.props.redirectTo('popularResults')}
							/>
						</div>
						<div css="flex: 50%;margin-left: 10px">
							<Searches
								dataSource={popularFilters}
								columns={popularFiltersCol}
								title="Popular Filters"
								onClick={() => this.props.redirectTo('popularFilters')}
							/>
						</div>
					</Flex>
				)}
			</React.Fragment>
		);
	}
}
Analytics.propTypes = {
	noResults: PropTypes.array,
	popularSearches: PropTypes.array,
	plan: PropTypes.string.isRequired,
	searchVolume: PropTypes.array,
	popularResults: PropTypes.array,
	popularFilters: PropTypes.array,
};

export default Analytics;
