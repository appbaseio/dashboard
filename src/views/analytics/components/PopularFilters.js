import React from 'react';
import Searches from './Searches';
import { getPopularFilters, popularSearchesFull } from './../utils';
import Loader from './Loader';

class PopularFilters extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isFetching: true,
			popularFilters: [],
		};
	}
	componentDidMount() {
		getPopularFilters(this.props.appName)
			.then((res) => {
				this.setState({
					popularFilters: res,
					isFetching: false,
				});
			})
			.catch(() => {
				this.setState({
					isFetching: false,
				});
			});
	}

	render() {
		if (this.state.isFetching) {
			return <Loader />;
		}
		return (
			<Searches
				showViewOption={false}
				columns={popularSearchesFull}
				dataSource={this.state.popularFilters}
				title="Popular Filters"
			/>
		);
	}
}

export default PopularFilters;
