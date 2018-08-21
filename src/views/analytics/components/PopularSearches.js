import React from 'react';
import PropTypes from 'prop-types';
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
				columns={popularSearchesFull(this.props.plan)}
				dataSource={this.state.popularSearches}
				title="Popular Searches"
				pagination={{
					pageSize: 10,
				}}
			/>
		);
	}
}
PopularSearches.propTypes = {
	plan: PropTypes.string,
	appName: PropTypes.string,
};

export default PopularSearches;
