import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import SearchApp from './SearchApp';
import Footer from '../components/Footer';

export default class Search extends Component {
	state = {
		selectedOption: this.props.facetFields.map(item => ({label: item, value: item})) || [],
	}

	handleChange = (selectedOption) => {
		this.setState({ selectedOption });
	}

	setFacetFields = () => {
		const values = this.state.selectedOption.map(item => item.value);
		this.props.setFacetFields(values);
	}

	renderSearchApp = () => {
		return (
			<div>
				{this.renderFacetInput(true)}
				<SearchApp fields={this.props.searchFields} facets={this.props.facetFields} />
			</div>
		);
	}

	renderFacetInput = (horizontal) => (
		<div className={`search-field-container ${horizontal ? 'full-row' : ''}`}>
			<div>
				<h3>Search Facets</h3>
				<p>Select the list of attributes you want to apply facets on.</p>
			</div>
			<Select
				name="form-field-name"
				value={this.state.selectedOption}
				onChange={this.handleChange}
				placeholder="Select facet fields"
				multi={true}
				options={[
					{ value: 'date', label: 'date' },
					{ value: 'topics', label: 'topics' },
					{ value: 'upvotes', label: 'upvotes' },
				]}
			/>
			<div style={{ textAlign: 'right', marginTop: 12 }}>
				<a className="button primary" onClick={this.setFacetFields}>Save</a>
			</div>
		</div>
	)

	render () {
		return (
			<div>
				<h2>Building Facets for your search screen</h2>
				<p>
					Lorem ipsum dolor sit amet consectetur, adipisicing elit.
					Delectus deleniti saepe iusto distinctio et obis autem labore quasi sequi
					ipsum sapiente voluptatum enim nihil!
				</p>

				{
					this.props.facetFields.length
						? this.renderSearchApp()
						: this.renderFacetInput()
				}

				<Footer nextScreen={this.props.nextScreen} disabled={!this.props.facetFields.length} />
			</div>
		);
	}
}
