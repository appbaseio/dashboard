import React, { Component } from 'react';
import { appbaseService } from '../../../service/AppbaseService';

export default class FilterByAppname extends Component {
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.state = {
			value: '',
		};
	}

	handleChange(e) {
		this.setState(
			{
				value: e.target.value,
			},
			this.applyFilter,
		);
	}

	applyFilter() {
		this.props.registerApps(appbaseService.filterByAppname(this.state.value));
	}

	render() {
		return (
			<span className="ad-filterbyappname pull-left">
				<input
					type="text"
					className="form-control"
					value={this.state.value}
					onChange={this.handleChange}
					placeholder="Filter cards by app name"
				/>
			</span>
		);
	}
}
