import React, { Component } from 'react';
import Footer from '../components/Footer';
import Loader from '../components/Loader';

import appbaseHelpers from '../utils/appbaseHelpers';

const jsonBlock = `
<div style="background: #DCF8FF; overflow:auto;width:auto;padding:1rem;"><pre style="margin: 0; line-height: 180%; border: 0; background: transparent; border-radius: 0;">[
	{
		<span style="color: #4070a0">&quot;genres&quot;</span><span style="color: #666666">:</span> <span style="color: #4070a0">&quot;Comedy&quot;</span>,
		<span style="color: #4070a0">&quot;original_language&quot;</span><span style="color: #666666">:</span> <span style="color: #4070a0">&quot;English&quot;</span>,
		<span style="color: #4070a0">&quot;original_title&quot;</span><span style="color: #666666">:</span> <span style="color: #4070a0">&quot;Minions&quot;</span>,
		<span style="color: #4070a0">&quot;overview&quot;</span><span style="color: #666666">:</span> <span style="color: #4070a0">&quot;Minions Stuart, Kevin and Bob are recruited by Scarlet Overkill, a super-villain who, alongside her inventor husband Herb, hatches a plot to take over the world.&quot;</span>,
		<span style="color: #4070a0">&quot;poster_path&quot;</span><span style="color: #666666">:</span> <span style="color: #4070a0">&quot;/q0R4crx2SehcEEQEkYObktdeFy.jpg&quot;</span>,
		<span style="color: #4070a0">&quot;release_year&quot;</span><span style="color: #666666">:</span> <span style="color: #40a070">2015</span>,
		<span style="color: #4070a0">&quot;tagline&quot;</span><span style="color: #666666">:</span> <span style="color: #4070a0">&quot;Before Gru, they had a history of bad bosses&quot;</span>
	},
	{
		<span style="color: #4070a0">&quot;genres&quot;</span><span style="color: #666666">:</span> <span style="color: #4070a0">&quot;Action&quot;</span>,
		<span style="color: #4070a0">&quot;original_language&quot;</span><span style="color: #666666">:</span> <span style="color: #4070a0">&quot;English&quot;</span>,
		<span style="color: #4070a0">&quot;original_title&quot;</span><span style="color: #666666">:</span> <span style="color: #4070a0">&quot;Wonder Woman&quot;</span>,
		<span style="color: #4070a0">&quot;overview&quot;</span><span style="color: #666666">:</span> <span style="color: #4070a0">&quot;An Amazon princess comes to the world of Man to become the greatest of the female superheroes.&quot;</span>,
		<span style="color: #4070a0">&quot;poster_path&quot;</span><span style="color: #666666">:</span> <span style="color: #4070a0">&quot;/imekS7f1OuHyUP2LAiTEM0zBzUz.jpg&quot;</span>,
		<span style="color: #4070a0">&quot;release_year&quot;</span><span style="color: #666666">:</span> <span style="color: #40a070">2017</span>,
		<span style="color: #4070a0">&quot;tagline&quot;</span><span style="color: #666666">:</span> <span style="color: #4070a0">&quot;Power. Grace. Wisdom. Wonder.&quot;</span>
	},
	...
]
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
			layout: 0,
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

	renderJSONBlock = () => (
		<div>
			<p>Showing a sample JSON to be imported:</p>
			<div style={{ width: '650px' }} className="code-block" dangerouslySetInnerHTML={{ __html: jsonBlock }} />
		</div>
	);

	setURL = (url) => {
		this.setState({
			url: url
		});
		this.props.setURL(url);
	}

	nextLayout = () => {
		this.setState({
			layout: 1,
		});
	}

	renderImportContent = () => {
		return (
			<div>
				<div className="wrapper">
					<div>
						<img src="/assets/images/onboarding/Import.svg" alt="importing data"/>
					</div>
					<div className="content">
						<header className="vcenter">
							<h2>Import data into your app</h2>
						</header>
						<div>
							<h3>There are three ways to bring your data into appbase.io:</h3>

							<div className="feature-list">
								<div>
									<div style={{ display: 'block' }}>
										<img
											src="/assets/images/onboarding/Dashboard.png"
											srcSet="/assets/images/onboarding/Dashboard.png 110w, /assets/images/onboarding/Dashboard@2x.png 220w"
											alt="Dashboard"
										/>
									</div>
									<p>Dashboard offers a GUI for import JSON/CSV files when creating a new app.</p>
								</div>
								<div>
									<div style={{ display: 'block' }}>
										<img
											src="/assets/images/onboarding/CLI.png"
											srcSet="/assets/images/onboarding/CLI.png 110w, /assets/images/onboarding/CLI@2x.png 220w"
											alt="CLI"
										/>
									</div>
									<p>A CLI for syncing data from popular databases like MongoDB, MySQL, PostgreSQL, MSSQL, JSON, CSV.</p>
								</div>
								<div>
									<div style={{ display: 'block' }}>
										<img
											src="/assets/images/onboarding/REST.png"
											srcSet="/assets/images/onboarding/REST.png 110w, /assets/images/onboarding/REST@2x.png 220w"
											alt="REST API"
										/>
									</div>
									<p>REST based APIs for indexing the data in programming language of your choice.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<footer>
					<div className="left-column" />
					<div className="right-column">
						<a className="button has-icon" onClick={this.nextLayout}>
							Next &nbsp; <img width="13" src="/assets/images/next.svg" alt=">"/>
						</a>
					</div>
				</footer>
			</div>
		);
	};

	render() {
		if (this.state.layout === 0) return this.renderImportContent();

		return (
			<div>
				<div className="wrapper">
					<div>
						<img src="/assets/images/onboarding/Import.svg" alt="importing data"/>
					</div>
					<div className="content">
						<header className="vcenter">
							<h2>Import data into your app</h2>
							{
								this.state.url
									? null
									: (<p>We will import a dataset of 500 movies obtained from TMDB</p>)
							}
						</header>

						{
							this.state.url
								? null
								: (
									<div className="col-wrapper">
										{this.renderJSONBlock()}
									</div>
								)
						}
					</div>
				</div>
				{
					this.state.url
						? (
							<div>
								<p>Explore your imported dataset for the movies store</p>
								<iframe
									src={`https://opensource.appbase.io/dejavu/live/#?input_state=${this.state.url}&hf=false&subscribe=false`}
									height="600px"
									width="100%"
									frameBorder="0"
									style={{ marginTop: '-10px' }}
									onLoad={this.hideLoader}
								/>
							</div>
						)
						: null
				}
				<Loader show={this.state.loading} label={this.state.status} />
				{
					this.state.url
						? (<Footer nextScreen={this.props.nextScreen} />)
						: (
							<footer>
								<div className="left-column" />
								<div className="right-column">
									<a onClick={this.setMapping} className="primary button big">Import Movies Dataset</a>
								</div>
							</footer>
						)
				}
			</div>
		);
	}
}
