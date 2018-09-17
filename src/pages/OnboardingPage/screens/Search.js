import React, { Component } from 'react';
import Select from 'react-select';

import SearchApp from './SearchApp';
import Footer from '../components/Footer';

export default class Search extends Component {
	state = {
		error: '',
		selectedOption: this.props.searchFields.map(item => ({ label: item, value: item })) || [],
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
		console.log(selectedOption);
		if (!selectedOption.length) {
			this.setError('There should be at least one field set for search.');
		} else {
			this.setState({
				selectedOption,
				error: '',
			});
			const values = selectedOption.map(item => item.value);
			this.props.setSearchFields(values);
		}
	};

	renderSearchApp = () => (
		<div>
			{this.renderSearchInput(true)}
			<SearchApp fields={this.props.searchFields} />
		</div>
	);

	renderSearchInput = horizontal => (
		<div
			style={{ marginTop: 0 }}
			className={`search-field-container ${horizontal ? 'full-row' : ''}`}
		>
			<div>
				<h3>Set Searchable Fields</h3>
				<p>
					Select the fields you want to search on. They will be updated dynamically in the
					UI.
				</p>
			</div>
			<div className="input-wrapper">
				<Select
					name="form-field-name"
					value={this.state.selectedOption}
					onChange={this.handleChange}
					placeholder="Select fields"
					isMulti
					isClearable={false}
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
						<img src="/static/images/onboarding/Searchable.svg" alt="search" />
					</div>
					<div className="content">
						<header>
							<h2>Set searchable fields</h2>
							<p>
								All fields in appbase.io are indexed to allow for a blazing fast
								querying performance.
							</p>
							<p>
								However, all fields aren
								{'’'}t created equal. When you set a field as{' '}
								<strong>Searchable</strong>, it gets an additional n-gram based
								analyzer applied which enables blazing fast auto-completion and
								partial match features.
							</p>
						</header>
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
