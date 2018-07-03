import React, { Component } from 'react';
import { Link } from 'react-router';
import { getClusters } from './utils';
import { machineMarks } from './new';

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

	renderClusterRegion = () => (
		<div className="region-info">
			<img src="/assets/images/flags/united-states.png" alt="US" />
			<span>East US</span>
		</div>
	);

	render() {
		if (this.state.isLoading) return 'Please Wait';
		if (!this.state.isLoading && !this.state.clustersAvailable) return '14 day trial screen';
		return (
			<section className="cluster-container container">
				<article>
					<h2>My Clusters</h2>

					<ul className="clusters-list">
						{
							this.state.clusters.map((cluster, index) => (
								<li key={cluster.name} className="cluster-card compact">
									<h3>{cluster.name} <span className="tag">{cluster.status}</span></h3>

									<div className="info-row">
										<div>
											<h4>Region</h4>
											{this.renderClusterRegion()}
										</div>

										<div>
											<h4>Pricing Plan</h4>
											<div>{this.state.clusters[index].pricing_plan}</div>
										</div>

										<div>
											<h4>ES Version</h4>
											<div>{this.state.clusters[index].es_version}</div>
										</div>

										<div>
											<h4>Memory</h4>
											<div>
												{
													this.getFromPricing(
														this.state.clusters[index].pricing_plan,
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
														this.state.clusters[index].pricing_plan,
														'disk',
													)
												}
											</div>
										</div>

										<div>
											<h4>Nodes</h4>
											<div>{this.state.clusters[index].total_nodes}</div>
										</div>

										<div>
											<button
												className="ad-theme-btn primary"
											>
												View Details
											</button>
										</div>
									</div>
								</li>
							))
						}

						<li className="cluster-card compact">
							<h3>Cluster B</h3>

							<div className="info-row">
								<div>
									<h4>Region</h4>
									<div className="region-info">
										<img src="/assets/images/flags/canada.png" alt="CA" />
										<span>Canada</span>
									</div>
								</div>

								<div>
									<h4>Pricing Plan</h4>
									<div>Production II</div>
								</div>

								<div>
									<h4>ES Version</h4>
									<div>5.6.3</div>
								</div>

								<div>
									<h4>Memory</h4>
									<div>16 GB</div>
								</div>

								<div>
									<h4>Disk Size</h4>
									<div>500 GB</div>
								</div>

								<div>
									<h4>Nodes</h4>
									<div>5</div>
								</div>

								<div>
									<button className="ad-theme-btn primary">View Details</button>
								</div>
							</div>
						</li>
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
