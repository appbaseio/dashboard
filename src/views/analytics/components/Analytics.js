import React from 'react';
import { Spin, Icon, Card } from 'antd';
import PropTypes from 'prop-types';
import Flex from './../../../shared/Flex';
import { popularFiltersCol, popularResultsCol } from './../utils';
import Searches from './Searches';
import SearchVolumeChart from '../../../shared/SearchVolumeChart';

const Analytics = ({
	noResults,
	popularSearches,
	searchVolume,
	popularFilters,
	popularResults,
	plan,
	redirectTo,
	loading,
}) => {
	if (loading) {
		const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
		return <Spin indicator={antIcon} />;
	}
	return (
		<React.Fragment>
			<Card title="Daily Search Volume">
				<SearchVolumeChart
					width={window.innerWidth - 300}
					height={300}
					data={searchVolume}
				/>
			</Card>
			<Flex css="width: 100%;margin-top: 20px">
				<div css="flex: 50%;margin-right: 10px">
					<Searches
						onClick={() => redirectTo('popularSearches')}
						dataSource={popularSearches}
						title="Popular Searches"
					/>
				</div>
				<div css="flex: 50%;margin-left: 10px">
					<Searches
						onClick={() => redirectTo('noResultSearches')}
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
							onClick={() => redirectTo('popularResults')}
						/>
					</div>
					<div css="flex: 50%;margin-left: 10px">
						<Searches
							dataSource={popularFilters}
							columns={popularFiltersCol}
							title="Popular Filters"
							onClick={() => redirectTo('popularFilters')}
						/>
					</div>
				</Flex>
			)}
		</React.Fragment>
	);
};
Analytics.propTypes = {
	noResults: PropTypes.array,
	popularSearches: PropTypes.array,
	plan: PropTypes.string.isRequired,
	searchVolume: PropTypes.array,
	popularResults: PropTypes.array,
	redirectTo: PropTypes.func,
	popularFilters: PropTypes.array,
};

export default Analytics;
