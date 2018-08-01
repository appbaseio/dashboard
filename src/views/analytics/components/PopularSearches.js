import React from 'react';
import Searches from './Searches';
import { getPopularSearches, popularSearchesFull } from './../utils';
import Loader from './Loader';

class PopularSearches extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isFetching: true,
			popularSearches: [],
		};
	}
	componentDidMount() {
		getPopularSearches(this.props.appName)
			.then((res) => {
				this.setState({
					popularSearches: res,
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
				dataSource={this.state.popularSearches}
				title="Popular Searches"
			/>
		);
	}
}

export default PopularSearches;
