import React, { Component } from 'react';
import { Link } from 'react-router';
import { appbaseService } from '../../service/AppbaseService';
import SortBy from './SortBy';

export default class Header extends Component {
	constructor(props) {
		super(props);
		this.fields = [{
			field: 'name',
			label: 'Name'
		}, {
			field: 'apiCalls',
			label: 'Api Calls'
		}, {
			field: 'records',
			label: 'Records'
		}];
	}

	renderFields() {
		return this.fields.map((item, index) => {
			return (
				<div key={index} className="col-xs-12 col-sm-4 sortBy-container">
					<SortBy field={item.field} label={item.label} {...this.props}></SortBy>
				</div>
			);
		});
	}

	render() {
		return (
			<div className="app-list-header app-list-item row" >
				{this.renderFields()}
			</div>
		);
	}

}
