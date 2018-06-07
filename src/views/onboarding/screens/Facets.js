import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import SearchApp from './SearchApp';
import Footer from '../components/Footer';

export default class Search extends Component {
	state = {
		error: '',
		selectedOption: this.props.facetFields.map(item => ({ label: item, value: item })) || [],
	};

	handleChange = (selectedOption) => {
		this.setState({ selectedOption });
	};

	setError = (e) => {
		if (this.interval) clearInterval(this.interval);
		this.setState(
			{
				error: e,
			},
			() => {
				this.interval = setTimeout(() => {
					this.setState({ error: '' });
				}, 5000);
			},
		);
	};

	handleChange = (selectedOption) => {
		if (!selectedOption.length) {
			this.setError('Aggregation fields cannot be empty.');
		} else {
			this.setState({
				selectedOption,
				error: '',
			});
			const values = selectedOption.map(item => item.value);
			this.props.setFacetFields(values);
		}
	};

	renderSearchApp = () => (
		<div>
			{this.renderFacetInput(true)}
			<SearchApp fields={this.props.searchFields} facets={this.props.facetFields} />
		</div>
	);

	renderFacetInput = horizontal => (
		<div className={`search-field-container ${horizontal ? 'full-row' : ''}`}>
			<div>
				<h3>Set Aggregation Fields</h3>
				<p>
					Select the fields you want to set to be of Aggregation kind. They will be
					updated dynamically in the UI.
				</p>
			</div>
			<div className="input-wrapper">
				<Select
					name="form-field-name"
					value={this.state.selectedOption}
					onChange={this.handleChange}
					placeholder="Select aggregation fields"
					multi
					clearable={false}
					options={[
						{ value: 'release_year', label: 'release_year' },
						{ value: 'genres', label: 'genres' },
						{ value: 'original_language', label: 'original_language' },
					]}
				/>
			</div>
			{this.state.error && (
				<p style={{ marginTop: 15, color: 'tomato' }}>{this.state.error}</p>
			)}
		</div>
	);

	render() {
		return (
			<div>
				<div className="wrapper">
					<div>
						<img src="/assets/images/onboarding/Aggregation.svg" alt="aggregations" />
					</div>
					<div className="content">
						<header>
							<h2>Set aggregation fields</h2>
							<p>
								Similarly, we can also set certain fields to be of{' '}
								<strong>Aggregation</strong>{' '}
								kind. These fields will be indexed into data-structures that are
								optimized for performing computations and sorting functionalites.
							</p>
							<p>
								We will start by letting you set certain fields to be of{' '}
								<strong>Aggregation</strong> kind.
							</p>
						</header>
						{this.props.facetFields.length ? null : this.renderFacetInput()}
					</div>
				</div>

				{this.props.facetFields.length ? this.renderSearchApp() : null}

				{/* <Footer
					nextScreen={this.props.nextScreen}
					previousScreen={this.props.previousScreen}
					disabled={!this.props.facetFields.length}
				/> */}
				<Footer
					nextScreen={this.props.nextScreen}
					previousScreen={this.props.previousScreen}
					disabled={!this.props.facetFields.length}
					label="Finish"
				/>
			</div>
		);
	}
}
