import React, { Component } from 'react';
import { Icon, notification } from 'antd';
import parser from 'url-parser-lite';

import Footer from '../components/Footer';
import Loader from '../components/Loader';
import appbaseHelpers from '../utils/appbaseHelpers';

const jsonBlock = `
<div style="background: #DCF8FF; overflow:auto;width:auto;padding:1rem;"><pre style="margin: 0; line-height: 180%; border: 0; background: transparent; border-radius: 0;">[
	{
		<span style="font-weight: bold; color: #4070a0">&quot;genres&quot;</span><span style="color: #666666">:</span> <span style="color: #4070a0">&quot;Comedy&quot;</span>,
		<span style="font-weight: bold; color: #4070a0">&quot;original_language&quot;</span><span style="color: #666666">:</span> <span style="color: #4070a0">&quot;English&quot;</span>,
		<span style="font-weight: bold; color: #4070a0">&quot;original_title&quot;</span><span style="color: #666666">:</span> <span style="color: #4070a0">&quot;Minions&quot;</span>,
		<span style="font-weight: bold; color: #4070a0">&quot;overview&quot;</span><span style="color: #666666">:</span> <span style="color: #4070a0">&quot;Minions Stuart, Kevin and Bob are recruited by Scarlet Overkill, a super-villain who, alongside her inventor husband Herb, hatches a plot to take over the world.&quot;</span>,
		<span style="font-weight: bold; color: #4070a0">&quot;poster_path&quot;</span><span style="color: #666666">:</span> <span style="color: #4070a0">&quot;https://image.tmdb.org/t/p/w185/q0R4crx2SehcEEQEkYObktdeFy.jpg&quot;</span>,
		<span style="font-weight: bold; color: #4070a0">&quot;release_year&quot;</span><span style="color: #666666">:</span> <span style="color: #40a070">2015</span>,
		<span style="font-weight: bold; color: #4070a0">&quot;tagline&quot;</span><span style="color: #666666">:</span> <span style="color: #4070a0">&quot;Before Gru, they had a history of bad bosses&quot;</span>
	},
	{
		<span style="font-weight: bold; color: #4070a0">&quot;genres&quot;</span><span style="color: #666666">:</span> <span style="color: #4070a0">&quot;Action&quot;</span>,
		<span style="font-weight: bold; color: #4070a0">&quot;original_language&quot;</span><span style="color: #666666">:</span> <span style="color: #4070a0">&quot;English&quot;</span>,
		<span style="font-weight: bold; color: #4070a0">&quot;original_title&quot;</span><span style="color: #666666">:</span> <span style="color: #4070a0">&quot;Wonder Woman&quot;</span>,
		<span style="font-weight: bold; color: #4070a0">&quot;overview&quot;</span><span style="color: #666666">:</span> <span style="color: #4070a0">&quot;An Amazon princess comes to the world of Man to become the greatest of the female superheroes.&quot;</span>,
		<span style="font-weight: bold; color: #4070a0">&quot;poster_path&quot;</span><span style="color: #666666">:</span> <span style="color: #4070a0">&quot;https://image.tmdb.org/t/p/w185/imekS7f1OuHyUP2LAiTEM0zBzUz.jpg&quot;</span>,
		<span style="font-weight: bold; color: #4070a0">&quot;release_year&quot;</span><span style="color: #666666">:</span> <span style="color: #40a070">2017</span>,
		<span style="font-weight: bold; color: #4070a0">&quot;tagline&quot;</span><span style="color: #666666">:</span> <span style="color: #4070a0">&quot;Power. Grace. Wisdom. Wonder.&quot;</span>
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
		this.setState(
			{
				status: '',
				error: e,
			},
			() => {
				this.interval = setTimeout(() => {
					this.setState({ error: '' });
				}, 5000);
			},
		);
	};

	setMapping = () => {
		this.setState({
			loading: true,
		});
		appbaseHelpers
			.applyAnalyzers()
			.then(() => {
				this.setState({
					status: 'Preparing the database configuration...',
				});
			})
			.then(appbaseHelpers.updateMapping)
			.then(() => {
				this.setState({
					status:
						'Indexing movies data of 500 records... Almost done!',
				});
			})
			.then(appbaseHelpers.indexData)
			.then(() => {
				this.setState({
					status: 'Loading data browser... Hang tight!',
				});
			})
			.then(() => {
				appbaseHelpers.createURL(this.setURL);
			})
			.catch(e => {
				if (
					e._bodyInit ===
					'{"error":{"root_cause":[{"type":"parse_exception","reason":"request body is required"}],"type":"parse_exception","reason":"request body is required"},"status":400}'
				) {
					appbaseHelpers.createURL(this.setURL);
				}
				console.log('@error-at-importing-data', e);
				console.log('@error-at-importing-data-response-type', typeof e);
				console.log('error', e);
				notification.error({
					message: 'Something went wrong',
					description:
						'Please try again & If the problem persists please report to us.',
				});
			});
	};

	hideLoader = () => {
		this.setState({
			status: '',
			loading: false,
		});
	};

	renderJSONBlock = () => (
		<div>
			<p>Showing a sample JSON to be imported:</p>
			<div
				style={{ width: '650px' }}
				className="code-block"
				dangerouslySetInnerHTML={{ __html: jsonBlock }}
			/>
		</div>
	);

	setURL = url => {
		this.setState({
			url,
		});
		this.props.setURL(url);
	};

	nextLayout = () => {
		this.setState({
			layout: 1,
		});
	};

	renderImportContent = () => (
		<div>
			<div className="wrapper">
				<div>
					<img
						src="/static/images/onboarding/Import.svg"
						alt="importing data"
					/>
				</div>
				<div className="content">
					<header className="vcenter">
						<h2>Import data into your app</h2>
					</header>
					<div>
						<h3>
							There are three ways to bring your data into
							appbase.io:
						</h3>

						<div className="feature-list">
							<div>
								<div style={{ display: 'block' }}>
									<img
										src="/static/images/onboarding/Dashboard.png"
										srcSet="/static/images/onboarding/Dashboard.png 110w, /static/images/onboarding/Dashboard@2x.png 220w"
										alt="Dashboard"
									/>
								</div>
								<p>
									Dashboard offers a GUI for importing
									JSON/CSV files when creating a new app.
								</p>
							</div>
							<div>
								<div style={{ display: 'block' }}>
									<img
										src="/static/images/onboarding/CLI.png"
										srcSet="/static/images/onboarding/CLI.png 110w, /static/images/onboarding/CLI@2x.png 220w"
										alt="CLI"
									/>
								</div>
								<p>
									<a
										className="dashed"
										href="https://github.com/appbaseio/abc"
										target="_blank"
										rel="noopener noreferrer"
									>
										CLI
									</a>{' '}
									syncs data from popular database and file
									formats like MongoDB, MySQL, PostgreSQL,
									SQLServer, Kafka, JSON and CSV.
								</p>
							</div>
							<div>
								<div style={{ display: 'block' }}>
									<img
										src="/static/images/onboarding/REST.png"
										srcSet="/static/images/onboarding/REST.png 110w, /static/images/onboarding/REST@2x.png 220w"
										alt="REST API"
									/>
								</div>
								<p>
									<a
										className="dashed"
										href="https://rest.appbase.io"
										target="_blank"
										rel="noopener noreferrer"
									>
										REST based APIs
									</a>{' '}
									enable indexing data in a programming
									language of your choice.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<footer>
				<div className="left-column" />
				<div className="right-column">
					<a className="button has-icon" onClick={this.nextLayout}>
						Next &nbsp; <Icon type="right" theme="outlined" />
					</a>
				</div>
			</footer>
		</div>
	);

	render() {
		if (this.state.layout === 0) return this.renderImportContent();

		const { url } = this.state;
		let iframeURL = null;
		if (url) {
			const config = JSON.parse(url);
			const { protocol, host, auth } = parser(config.url);
			const dejavuAddress = `${protocol}://${auth}@${host}`;
			iframeURL = `https://dejavu.appbase.io/?appname=${config.appname}&url=${dejavuAddress}&footer=false&sidebar=false&appswitcher=false&mode=view&cloneApp=false&oldBanner=false`;
		}

		return (
			<div>
				<div className="wrapper">
					<div>
						<img
							src="/static/images/onboarding/Import.svg"
							alt="importing data"
						/>
					</div>
					<div className="content">
						<header className="vcenter">
							<h2>Import data into your app</h2>
							{this.state.url ? (
								<p>
									Explore your imported dataset for the movies
									store.
								</p>
							) : (
								<p>
									We will import a dataset of 500 movies
									obtained from TMDB.
								</p>
							)}
						</header>

						{this.state.url ? null : (
							<div className="col-wrapper">
								{this.renderJSONBlock()}
							</div>
						)}
					</div>
				</div>
				{iframeURL ? (
					<div>
						<iframe
							height="600px"
							width="100%"
							title="dejavu"
							src={iframeURL}
							frameBorder="0"
							style={{ marginTop: '-10px' }}
							onLoad={this.hideLoader}
						/>
					</div>
				) : null}
				<Loader show={this.state.loading} label={this.state.status} />
				{this.state.url ? (
					<Footer nextScreen={this.props.nextScreen} />
				) : (
					<footer>
						<div className="left-column" />
						<div className="right-column">
							<a
								onClick={this.setMapping}
								className="primary button big"
							>
								Import Movies Dataset
							</a>
						</div>
					</footer>
				)}
			</div>
		);
	}
}
