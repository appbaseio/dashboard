import React, { Component } from 'react';
import Footer from '../components/Footer';
import Loader from '../components/Loader';

import appbaseHelpers from '../utils/appbaseHelpers';

const jsonBlock = `
<div style="background: #DCF8FF; overflow:auto;width:auto;padding:1rem;"><pre style="margin: 0; line-height: 180%; border: 0; background: transparent; border-radius: 0;">{
	<span style="color: #4070a0">&quot;genres&quot;</span><span style="color: #666666">:</span> <span style="color: #4070a0">&quot;Comedy&quot;</span>,
	<span style="color: #4070a0">&quot;original_language&quot;</span><span style="color: #666666">:</span> <span style="color: #4070a0">&quot;English&quot;</span>,
	<span style="color: #4070a0">&quot;original_title&quot;</span><span style="color: #666666">:</span> <span style="color: #4070a0">&quot;Minions&quot;</span>,
	<span style="color: #4070a0">&quot;overview&quot;</span><span style="color: #666666">:</span> <span style="color: #4070a0">&quot;Minions Stuart, Kevin and Bob are recruited by Scarlet Overkill, a super-villain who, alongside her inventor husband Herb, hatches a plot to take over the world.&quot;</span>,
	<span style="color: #4070a0">&quot;poster_path&quot;</span><span style="color: #666666">:</span> <span style="color: #4070a0">&quot;/q0R4crx2SehcEEQEkYObktdeFy.jpg&quot;</span>,
	<span style="color: #4070a0">&quot;release_year&quot;</span><span style="color: #666666">:</span> <span style="color: #40a070">2015</span>,
	<span style="color: #4070a0">&quot;tagline&quot;</span><span style="color: #666666">:</span> <span style="color: #4070a0">&quot;Before Gru, they had a history of bad bosses&quot;</span>
}
</pre></div>
`;

export default class Introduction extends Component {
	constructor(props) {
		super(props);

		this.state = {
			status: 'Applying relevant settings...',
			error: '',
			loading: false,
			url: props.url,
		};
	}

	setError = e => {
		if (this.interval) clearInterval(this.interval);
		this.setState({
			status: '',
			error: e,
		}, () => {
			this.interval = setTimeout(() => {
				this.setState({ error: '' });
			}, 5000);
		});
	};

	setMapping = () => {
		this.setState({
			loading: true
		});
		appbaseHelpers.applyAnalyzers()
			.then(() => {
				this.setState({
					status: 'Preparing the database configuration...'
				});
			})
			.then(appbaseHelpers.updateMapping)
			.then(() => {
				this.setState({
					status: 'Indexing movies data of 500 records... Almost done!'
				});
			})
			.then(appbaseHelpers.indexData)
			.then(res => {
				this.setState({
					status: 'Loading data browser... Hang tight!'
				});
			})
			.then(() => {
				appbaseHelpers.createURL(this.setURL);
			})
			.catch(e => {
				console.log('error', e);
			})
	}

	hideLoader = () => {
		this.setState({
			status: '',
			loading: false,
		});
	}

	renderJSONBlock = () => (<div className="code-block" dangerouslySetInnerHTML={{ __html: jsonBlock }} />);

	setURL = (url) => {
		this.setState({
			url: url
		});
		this.props.setURL(url);
	}

	render() {
		return (
			<div>
				<div className="wrapper">
					<div>
						<img src="/assets/images/onboarding/Import.svg" alt="importing data"/>
					</div>
					<div className="content">
						<header>
							<h2>Import data from anywhere into your app</h2>
							<p>JSON, CSV, Mongo or SQL - we've got you covered</p>
						</header>

						{
							this.state.url
								? null
								: (
									<div className="col-wrapper">
										{this.renderJSONBlock()}
										<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
											<a style={{ margin: 60 }} onClick={this.setMapping} className="primary button">Import Data</a>
										</div>
									</div>
								)
						}
					</div>
				</div>
				{
					this.state.url
						? (
							<iframe
								src={`https://opensource.appbase.io/dejavu/live/#?input_state=${this.state.url}&hf=false&subscribe=false`}
								height="600px"
								width="100%"
								frameBorder="0"
								style={{ marginTop: '-10px' }}
								onLoad={this.hideLoader}
							/>
						)
						: null
				}
				<Loader show={this.state.loading} label={this.state.status} />
				<Footer nextScreen={this.props.nextScreen} previousScreen={this.props.previousScreen} disabled={!this.state.url} />
			</div>
		);
	}
}
