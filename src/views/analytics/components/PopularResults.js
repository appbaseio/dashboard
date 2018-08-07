import React from 'react';
import PropTypes from 'prop-types';
import Searches from './Searches';
import { getPopularResults, popularResultsFull } from './../utils';
import Loader from './Loader';

class PopularResults extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isFetching: true,
			popularResults: [],
		};
	}
	componentDidMount() {
		getPopularResults(this.props.appName)
			.then((res) => {
				this.setState({
					popularResults: res,
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
				columns={popularResultsFull(this.props.plan)}
				dataSource={this.state.popularResults}
				title="Popular Results"
			/>
		);
	}
}

PopularResults.propTypes = {
	plan: PropTypes.string,
	appName: PropTypes.string,
};
export default PopularResults;
