import React,{ Component } from 'react';
import { appbaseService } from '../../../service/AppbaseService';

export default class SortBy extends Component {

	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.state = {
			value: appbaseService.SortBy
		};
	}

	handleChange(event) {
		this.setState({
			value: event.target.value
		}, this.applySort);
	}

	applySort() {
		this.props.registerApps(appbaseService.applySort(this.props.apps, this.state.value));
	}

	render() {
		return (
			<div className="col-xs-4 col-sm-3 dropdown dropdown-sortby">
				<select defaultValue={this.state.value} onChange={this.handleChange} className="form-control">
					<option value="lastActiveDate">Last activity</option>
					<option value="info.appStats.records">Records</option>
					<option value="info.appStats.calls">Api Calls</option>
				</select>
			</div>
		);
	}

}