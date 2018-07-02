import React, { Component } from 'react';
import { getClusters } from './utils';

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
		getClusters()
			.then((clusters) => {
				this.setState({
					clustersAvailable: !!clusters.length,
					clusters,
					isLoading: false,
				});
			})
			.catch((e) => {
				console.error(e);
				this.setState({
					isLoading: false,
				});
			});
	}

	render() {
		if (this.state.isLoading) return 'Please Wait';
		if (!this.state.isLoading && !this.state.clustersAvailable) return '14 day trial screen';
		return (
			<section className="cluster-container container">
				<article>
					<h2>My Clusters</h2>

					<ul className="clusters-list">
						<li className="cluster-card compact">
							<h3>Cluster A</h3>

							<div className="info-row">
								<div>
									<h4>Region</h4>
									<div className="region-info">
										<img src="/assets/images/flags/united-states.png" alt="US" />
										<span>East US</span>
									</div>
								</div>

								<div>
									<h4>Pricing Plan</h4>
									<div>Hobby</div>
								</div>

								<div>
									<h4>ES Version</h4>
									<div>6.2.4</div>
								</div>

								<div>
									<h4>Memory</h4>
									<div>8 GB</div>
								</div>

								<div>
									<h4>Disk Size</h4>
									<div>240 GB</div>
								</div>

								<div>
									<h4>Nodes</h4>
									<div>3</div>
								</div>

								<div>
									<button className="ad-theme-btn primary">View Details</button>
								</div>
							</div>
						</li>

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
						<button className="ad-theme-btn primary">
							<i className="fas fa-plus" />&nbsp;
							Create a New Cluster
						</button>
					</div>
				</article>
			</section>
		);
	}
}
