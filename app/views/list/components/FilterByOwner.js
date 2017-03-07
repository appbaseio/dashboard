import React,{ Component } from 'react';
import { appbaseService } from '../../../service/AppbaseService';

export default class FilterByOwner extends Component {

	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.state = {
			value: appbaseService.filterBy
		};
	}

	handleChange(event) {
		this.setState({
			value: event.target.value
		}, this.applyFilter);
	}

	applyFilter() {
		this.props.registerApps(appbaseService.applyFilter(this.props.apps, this.state.value));
	}

	render() {
		return (
			<div className="dropdown dropdown-filterbyowner">
				<select defaultValue={this.state.value} onChange={this.handleChange} class="form-control">
					<option value="all">All</option>
					<option value="myapps">My Apps</option>
					<option value="shared">Shared apps</option>
				</select>
			</div>
		);
	}

}