import React from 'react';
import Searches from './Searches';
import { getNoResultSearches, popularSearchesFull } from './../utils';
import Loader from './Loader';

class NoResultsSearch extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isFetching: true,
			noResults: [],
		};
	}
	componentDidMount() {
		getNoResultSearches(this.props.appName)
			.then((res) => {
				this.setState({
					noResults: res,
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
				dataSource={this.state.noResults}
				title="No Results Searches"
			/>
		);
	}
}

export default NoResultsSearch;
