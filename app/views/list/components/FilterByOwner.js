import React,{ Component } from 'react';
import { appbaseService } from '../../../service/AppbaseService';

export default class FilterByOwner extends Component {

	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.state = {
			sharedApps: appbaseService.sharedApps
		};
	}

	handleChange(e) {
		this.setState({
			sharedApps: e.target.checked
		}, this.applyFilter);
		this.props.toggleShared();
	}

	applyFilter() {
		this.props.registerApps(appbaseService.filterBySharedApps(this.state.sharedApps));
	}

	render() {
		return (
			<span className="ad-filterbyowner pull-left">
				<label htmlFor="filterowner" className="ad-filter-shareapps checkbox-inline">
					<input type="checkbox" id="filterowner" checked={this.state.sharedApps} onChange={this.handleChange} />
					Show shared apps
				</label>
			</span>
		);
	}

}
