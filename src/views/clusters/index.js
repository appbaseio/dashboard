import React, { Component } from 'react';
import { Link } from 'react-router';
import { getClusters } from './utils';
import { machineMarks } from './new';

const regions = {
	eastus: { name: 'East US', flag: 'united-states.png' },
	centralus: { name: 'East US', flag: 'united-states.png' },
	westeurope: { name: 'West Europe', flag: 'europe.png' },
	canadacentral: { name: 'Canada Central', flag: 'canada.png' },
	canadaeast: { name: 'Canada East', flag: 'canada.png' },
};

export default class Clusters extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoading: true,
			clustersAvailable: true,
			clusters: [],
		};
	}

	componentDidMount() {
		this.initClusters();
	}

	getFromPricing = (plan, key) => {
		const selectedPlan = Object.values(machineMarks)
			.find(item => item.label === plan);

		return (selectedPlan ? selectedPlan[key] : '-') || '-';
	}

	initClusters = () => {
		getClusters()
			.then((clusters) => {
				this.setState({
					clustersAvailable: !!clusters.length,
					clusters,
					isLoading: false,
				});

				clusters.every((cluster) => {
					if (cluster.status === 'In progress') {
						setTimeout(this.initClusters, 30000);
						return false;
					}
					return true;
				});
			})
			.catch((e) => {
				console.error(e);
				this.setState({
					isLoading: false,
				});
			});
	}

	renderClusterRegion = (region) => {
		if (!region) return null;

		const { name, flag } = regions[region];
		return (
			<div className="region-info">
				<img src={`/assets/images/flags/${flag}`} alt="US" />
				<span>{name}</span>
			</div>
		);
	}

	render() {
		const vcenter = {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			height: 'calc(100vh - 200px)',
			width: '100%',
			fontSize: '20px',
		};

		if (this.state.isLoading) {
			return (
				<div style={vcenter}>
					Loading clusters...
				</div>
			);
		}

		if (!this.state.isLoading && !this.state.clustersAvailable) {
			return (
				<div style={vcenter}>
					<i className="fas fa-gift" style={{ fontSize: 36 }} />
					<h2 style={{ fontSize: 22 }}>You{"'"}ve unlocked 14 days free trial</h2>
					<p style={{ margin: '15px 0 20px', fontSize: 16 }}>Get started with clusters today</p>
					<div style={{ textAlign: 'center' }}>
						<Link to="/clusters/new">
							<button className="ad-theme-btn primary">
								<i className="fas fa-plus" />&nbsp;
								Create a New Cluster
							</button>
						</Link>
					</div>
				</div>
			);
		}

		return (
			<section className="cluster-container container">
				<article>
					<h2>My Clusters</h2>

					<ul className="clusters-list">
						{
							this.state.clusters.map(cluster => (
								<li key={cluster.name} className="cluster-card compact">
									<h3>{cluster.name} <span className="tag">{cluster.status}</span></h3>

									<div className="info-row">
										<div>
											<h4>Region</h4>
											{this.renderClusterRegion(cluster.region)}
										</div>

										<div>
											<h4>Pricing Plan</h4>
											<div>{cluster.pricing_plan}</div>
										</div>

										<div>
											<h4>ES Version</h4>
											<div>{cluster.es_version}</div>
										</div>

										<div>
											<h4>Memory</h4>
											<div>
												{
													this.getFromPricing(
														cluster.pricing_plan,
														'memory',
													)
												}
											</div>
										</div>

										<div>
											<h4>Disk Size</h4>
											<div>
												{
													this.getFromPricing(
														cluster.pricing_plan,
														'disk',
													)
												}
											</div>
										</div>

										<div>
											<h4>Nodes</h4>
											<div>{cluster.total_nodes}</div>
										</div>

										<div>
											<Link to={`/clusters/${cluster.id}`}>
												<button
													className="ad-theme-btn primary"
												>
													View Details
												</button>
											</Link>
										</div>
									</div>
								</li>
							))
						}
					</ul>

					<div style={{ textAlign: 'center', margin: '40px 0' }}>
						<Link to="/clusters/new">
							<button className="ad-theme-btn primary">
								<i className="fas fa-plus" />&nbsp;
								Create a New Cluster
							</button>
						</Link>
					</div>
				</article>
			</section>
		);
	}
}
