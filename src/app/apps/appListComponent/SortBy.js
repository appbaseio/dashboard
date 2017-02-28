import React,{ Component } from 'react';
import { Link } from 'react-router';
import { appbaseService } from '../../service/AppbaseService';
import classNames from "classnames";

export default class SortBy extends Component {

	constructor(props) {
		super(props);
		this.state = {
			sortBy: appbaseService.sortBy
		};
		this.applySort = this.applySort.bind(this);
	}

	applySort() {
		const apps = appbaseService.applySort(this.props.apps, this.props.field);
		this.props.registerApps(apps);
		this.setState({
			sortBy: appbaseService.sortBy
		});
	}

	render() {
		const cx = classNames({
			"active": this.state.sortBy.field === this.props.field
		});

		return (
			<button className={`sortBy ${cx}`} onClick={this.applySort}>
				{this.props.label}&nbsp;&nbsp;
				{this.state.sortBy.field === this.props.field && this.state.sortBy.order === 'asc' ? (<i className="fa fa-sort-asc"></i>) : null}
				{this.state.sortBy.field === this.props.field && this.state.sortBy.order === 'desc' ? (<i className="fa fa-sort-desc"></i>) : null}
			</button>
		);
	}

}
