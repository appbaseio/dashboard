import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import SearchApp from './SearchApp';
import Footer from '../components/Footer';

export default class Search extends Component {
	state = {
		error: '',
		selectedOption: this.props.searchFields.map(item => ({ label: item, value: item })) || [],
	};

	setError = e => {
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

	handleChange = selectedOption => {
		if (!selectedOption.length) {
			this.setError('Search fields cannot be empty.');
		} else {
			this.setState({
				selectedOption,
				error: '',
			});
			const values = selectedOption.map(item => item.value);
			this.props.setSearchFields(values);
		}
	};

	renderSearchApp = () => {
		return (
			<div>
				{this.renderSearchInput(true)}
				<SearchApp fields={this.props.searchFields} />
			</div>
		);
	};

	renderSearchInput = horizontal => (
		<div
			style={{ marginTop: 0 }}
			className={`search-field-container ${horizontal ? 'full-row' : ''}`}
		>
			<div>
				<h3>Searchable Fields</h3>
				<p>Select the list of attributes you want to search in.</p>
			</div>
			<div className="input-wrapper">
				<Select
					name="form-field-name"
					value={this.state.selectedOption}
					onChange={this.handleChange}
					placeholder="Select fields"
					multi={true}
					clearable={false}
					options={[
						{ value: 'original_title', label: 'original_title' },
						{ value: 'overview', label: 'overview' },
						{ value: 'tagline', label: 'tagline' },
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
						<img src="/assets/images/onboarding/Searchable.svg" alt="search" />
					</div>
					<div className="content">
						<header>
							<h2>Set searchable fields</h2>
						</header>
						<p>
							All fields in appbase.io are indexed to allow for a blazing fast
							querying performance. However, all fields aren't created equal.
						</p>
						<p>
							Fields that are searchable require a specific n-gram mapping to provide
							an auto-complete like behavior.
						</p>
						<h3>We will start by letting you set certain fields as Searchable.</h3>
						{this.props.searchFields.length ? null : this.renderSearchInput()}
					</div>
				</div>

				{this.props.searchFields.length ? this.renderSearchApp() : null}

				<Footer
					nextScreen={this.props.nextScreen}
					previousScreen={this.props.previousScreen}
					disabled={!this.props.searchFields.length}
				/>
			</div>
		);
	}
}
