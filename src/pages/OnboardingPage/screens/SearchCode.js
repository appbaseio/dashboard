import React, { Component } from 'react';
import Select from 'react-select';

import SearchApp from './SearchApp';
import Footer from '../components/Footer';

export default class SearchCode extends Component {
	state = {
		error: '',
		selectedOption: this.props.ui ? { label: this.props.ui, value: this.props.ui } : '',
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
		this.setState({
			selectedOption,
			error: '',
		});
		const value = selectedOption.value;
		this.props.setUIField(value);
	};

	renderSearchApp = () => (
		<div>
			{this.renderSearchInput(true)}
			<SearchApp
				fields={this.props.searchFields}
				facets={this.props.facetFields}
				ui={this.props.ui}
			/>
		</div>
	);

	renderSearchInput = horizontal => (
		<div
			style={{ marginTop: 0 }}
			className={`search-field-container ${horizontal ? 'full-row' : ''}`}
		>
			<div>
				<h3>Choose the library</h3>
				<p>You can check the Results in below search app.</p>
			</div>
			<div className="input-wrapper">
				<Select
					name="form-field-name"
					value={this.state.selectedOption}
					onChange={this.handleChange}
					placeholder="Select fields"
					isClearable={false}
					options={[
						{ value: 'react', label: 'reactivesearch' },
						{ value: 'appbase_js', label: 'appbase-js' },
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
							<h2>Build your UI</h2>
							<p>
								We provide different libraries to consume the results{' '}
								<strong>(hits)</strong> returned from appbase API which helps in
								rendering the UI
							</p>
							<p>
								We recommend using <code>ReactiveSearch</code> library which
								provides a range of UI components that you can use to build your
								application.
							</p>
						</header>
						<h4>We will start by letting you choose the library</h4>
						{this.props.ui ? null : this.renderSearchInput()}
					</div>
				</div>

				{this.renderSearchApp()}

				<Footer
					nextScreen={this.props.nextScreen}
					previousScreen={this.props.previousScreen}
					disabled={!this.props.ui}
					label="Finish"
					app={this.props.app}
				/>
			</div>
		);
	}
}
