import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import SearchApp from './SearchApp';
import Footer from '../components/Footer';

export default class Search extends Component {
	state = {
		selectedOption: this.props.searchFields.map(item => ({label: item, value: item})) || [],
	}

	handleChange = (selectedOption) => {
		this.setState({ selectedOption });
	}

	setSearchFields = () => {
		const values = this.state.selectedOption.map(item => item.value);
		this.props.setSearchFields(values);
	}

	renderSearchApp = () => {
		return (
			<div>
				{this.renderSearchInput(true)}
				<SearchApp fields={this.props.searchFields} />
			</div>
		);
	}

	renderSearchInput = (horizontal) => (
		<div className={`search-field-container ${horizontal ? 'full-row' : ''}`}>
			<div>
				<h3>Searchable Fields</h3>
				<p>Select the list of attributes you want to search in.</p>
			</div>
			<Select
				name="form-field-name"
				value={this.state.selectedOption}
				onChange={this.handleChange}
				placeholder="Select fields"
				multi={true}
				options={[
					{ value: 'name', label: 'name' },
					{ value: 'tagline', label: 'tagline' },
					{ value: 'topics', label: 'topics' },
				]}
			/>
			<div style={{ textAlign: 'right', marginTop: 12 }}>
				<a className="button primary" onClick={this.setSearchFields}>Save</a>
			</div>
		</div>
	)

	render () {
		return (
			<div>
				<h2>Set Searchable Fields</h2>
				<p>
					All fields in appbase.io are indexed to allow for a blazing fast querying performance. However, all fields aren't created equal.
				</p>
				<p>
					Fields that are searchable require a specific n-gram mapping to provide an auto-complete like behavior.
				</p>
				<p>
					We will start by letting you set certain fields as Searchable.
				</p>
				{
					this.props.searchFields.length
						? this.renderSearchApp()
						: this.renderSearchInput()
				}

				<Footer nextScreen={this.props.nextScreen} disabled={!this.props.searchFields.length} />
			</div>
		);
	}
}
