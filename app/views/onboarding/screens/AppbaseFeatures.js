import React, { Component } from 'react';

import SearchApp from './SearchApp';
import Footer from '../components/Footer';
import appbaseHelpers from '../utils/appbaseHelpers';

const jsonBlock = `
<div style="background: #fefefe; overflow:auto;width:auto;padding:1rem;"><pre style="margin: 0; line-height: 180%; border: 0; background: transparent; border-radius: 0;">{
	<span style="color: #4070a0">&quot;genres&quot;</span><span style="color: #666666">:</span> <span style="color: #4070a0">&quot;Action&quot;</span>,
	<span style="color: #4070a0">&quot;original_language&quot;</span><span style="color: #666666">:</span> <span style="color: #4070a0">&quot;English&quot;</span>,
	<span style="color: #4070a0">&quot;original_title&quot;</span><span style="color: #666666">:</span> <span style="color: #4070a0">&quot;Star Wars: The Last Jedi&quot;</span>,
	<span style="color: #4070a0">&quot;overview&quot;</span><span style="color: #666666">:</span> <span style="color: #4070a0">&quot;Rey develops her newly discovered abilities with the guidance of Luke Skywalker, who is unsettled by the strength of her powers. Meanwhile, the Resistance prepares to do battle with the First Order.&quot;</span>,
	<span style="color: #4070a0">&quot;poster_path&quot;</span><span style="color: #666666">:</span> <span style="color: #4070a0">&quot;/kOVEVeg59E0wsnXmF9nrh6OmWII.jpg&quot;</span>,
	<span style="color: #4070a0">&quot;release_year&quot;</span><span style="color: #666666">:</span> <span style="color: #40a070">2017</span>,
	<span style="color: #4070a0">&quot;tagline&quot;</span><span style="color: #666666">:</span> <span style="color: #4070a0">&quot;Episode VIII - The Last Jedi&quot;</span>
}
</pre></div>
`;

export default class AppbaseFeatures extends Component {
	state = {
		showJSONBlock: false,
	}

	showJSONBlock = () => {
		this.setState({
			showJSONBlock: true,
		});
	}

	hideJSONBlock = () => {
		this.setState({
			showJSONBlock: false,
		});
	}

	indexData = () => {
		this.hideJSONBlock();
		appbaseHelpers.indexNewData();
	}

	renderIndexBlock = () => (
		<div style={{ marginTop: 0 }} className="search-field-container full-row">
			<div>
				<h3>Streaming updates</h3>
				<p>Add new movies data in real-time</p>
			</div>
			<div className="input-wrapper" onMouseLeave={this.hideJSONBlock} style={{ flexDirection: 'row-reverse', position: 'relative' }}>
				<a className="button primary" onMouseOver={this.showJSONBlock} onClick={this.indexData}>Add New Movie</a>

				<div className={`code-block hoverable ${this.state.showJSONBlock ? 'show' : ''}`} dangerouslySetInnerHTML={{ __html: jsonBlock }} />
			</div>
		</div>
	);

	renderSearchApp = () => {
		return (
			<div>
				<SearchApp fields={this.props.searchFields} facets={this.props.facetFields} />
			</div>
		);
	}

	render() {
		return (
			<div>
				<div className="wrapper">
					<div>
						<img src="/assets/images/onboarding/Realtime.svg" alt="realtime appbase.io"/>
					</div>
					<div className="content">
						<header>
							<h2>Stream Realtime Updates</h2>
						</header>
						<p>
							appbase.io has built-in support for streaming realtime updates on documents and queries.
						</p>
					</div>
				</div>
				{this.renderIndexBlock()}
				{this.renderSearchApp()}
				<Footer nextScreen={this.props.nextScreen} previousScreen={this.props.previousScreen} label="Finish" />
			</div>
		);
	}
}
