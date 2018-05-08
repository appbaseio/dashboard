import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import SearchApp from './SearchApp';
import Footer from '../components/Footer';

export default class Search extends Component {
	state = {
		error: '',
		selectedOption: this.props.facetFields.map(item => ({label: item, value: item})) || [],
	}

	handleChange = (selectedOption) => {
		this.setState({ selectedOption });
	}

	setError = e => {
		if (this.interval) clearInterval(this.interval);
		this.setState({
			error: e,
		}, () => {
			this.interval = setTimeout(() => {
				this.setState({ error: '' });
			}, 5000);
		});
	};

	setFacetFields = () => {
		if (!this.state.selectedOption.length) {
			this.setError('Please select atleast one aggregation field to continue');
		} else {
			this.setState({
				error: ''
			});
			const values = this.state.selectedOption.map(item => item.value);
			this.props.setFacetFields(values);
		}
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
				<h3>Set Aggregation Fields</h3>
				<p>Set at least one aggregation field.</p>
			</div>
			<div className="input-wrapper">
				<Select
					name="form-field-name"
					value={this.state.selectedOption}
					onChange={this.handleChange}
					placeholder="Select facet fields"
					multi={true}
					clearable={false}
					options={[
						{ value: 'release_year', label: 'release_year' },
						{ value: 'genres', label: 'genres' },
						{ value: 'original_language', label: 'original_language' }
					]}
				/>
				<a className="button primary" onClick={this.setFacetFields}>Save</a>
			</div>
			{
				this.state.error && (<p style={{ marginTop: 15, color: 'tomato' }}>{this.state.error}</p>)
			}
		</div>
	)

	render () {
		return (
			<div>
				<div className="wrapper">
					<div>
						<img src="/assets/images/onboarding/Aggregation.svg" alt="aggregations"/>
					</div>
					<div className="content">
						<header>
							<h2>Set Aggregation Fields</h2>
						</header>
						<p>
							Based on how each field will be used in your app UI, you can set them as Searchable, or as Aggregation friendly, or as some other type.
						</p>
						{
							this.props.facetFields.length
								? null
								: this.renderFacetInput()
						}
					</div>
				</div>

				{
					this.props.facetFields.length
						? this.renderSearchApp()
						: null
				}

				<Footer nextScreen={this.props.nextScreen} previousScreen={this.props.previousScreen} disabled={!this.props.facetFields.length} />
			</div>
		);
	}
}
