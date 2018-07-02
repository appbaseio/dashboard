import React, { Component } from 'react';
import CopyToClipboard from '../../shared/CopyToClipboard';

export default class Clusters extends Component {
	constructor(props) {
		super(props);

		this.state = {
			clustersAvailable: true,
		};
	}

	componentDidMount() {
		// if no clusters found move to /new
	}

	render() {
		return (
			<section className="cluster-container container">
				<article>
					<h2>Cluster A <span className="tag">Version 6.2.4</span></h2>

					<ul className="clusters-list">
						<li className="cluster-card">
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
							</div>
						</li>

						<li className="card">
							<div className="col light">
								<h3>Endpoints</h3>
								<p>Plug-ins and Add-ons</p>
							</div>

							<div className="col">
								<div className="cluster-endpoint">
									<h4>
										<a href="#">
											<i className="fas fa-external-link-alt" />
											Elasticsearch
										</a>
									</h4>
									<div className="creds-box">
										<span>
											####################################
										</span>
										<span>
											<a>
												<i className="fas fa-eye" />
											</a>
											<CopyToClipboard
												type="danger"
												onSuccess={() => {}}
												onError={() => {}}
											>
												<a data-clipboard-text="yolo">
													<i className="far fa-clone" />
												</a>
											</CopyToClipboard>
										</span>
									</div>
								</div>

								<div className="cluster-endpoint">
									<h4>
										<a href="#">
											<i className="fas fa-external-link-alt" />
											Kibana
										</a>
									</h4>
									<div className="creds-box">
										<span>
											####################################
										</span>
										<span>
											<a>
												<i className="fas fa-eye" />
											</a>
											<CopyToClipboard
												type="danger"
												onSuccess={() => {}}
												onError={() => {}}
											>
												<a data-clipboard-text="yolo">
													<i className="far fa-clone" />
												</a>
											</CopyToClipboard>
										</span>
									</div>
								</div>

								<div className="cluster-endpoint">
									<h4>
										<a href="#">
											<i className="fas fa-external-link-alt" />
											Logstash
										</a>
									</h4>
									<div className="creds-box">
										<span>
											####################################
										</span>
										<span>
											<a>
												<i className="fas fa-eye" />
											</a>
											<CopyToClipboard
												type="danger"
												onSuccess={() => {}}
												onError={() => {}}
											>
												<a data-clipboard-text="yolo">
													<i className="far fa-clone" />
												</a>
											</CopyToClipboard>
										</span>
									</div>
								</div>

								<div className="cluster-endpoint">
									<h4>
										<a href="#">
											<i className="fas fa-external-link-alt" />
											Dejavu
										</a>
									</h4>
									<div className="creds-box">
										<span>
											####################################
										</span>
										<span>
											<a>
												<i className="fas fa-eye" />
											</a>
											<CopyToClipboard
												type="danger"
												onSuccess={() => {}}
												onError={() => {}}
											>
												<a data-clipboard-text="yolo">
													<i className="far fa-clone" />
												</a>
											</CopyToClipboard>
										</span>
									</div>
								</div>
							</div>
						</li>

						<li className="card">
							<div className="col light">
								<h3>Active pricing plan</h3>
								<p>Production II</p>
							</div>

							<div className="col grey" style={{ width: 350 }}>
								<div className="cluster-info">
									<div className="cluster-info__item">
										<div>
											10 GB
										</div>
										<div>Storage (SSD)</div>
									</div>
									<div className="cluster-info__item">
										<div>
											120 GB
										</div>
										<div>Memory</div>
									</div>
									<div className="cluster-info__item">
										<div>
											3 Nodes
										</div>
										<div>HA</div>
									</div>
								</div>
								<div className="cluster-info">
									<div>
										<div className="price">
											<span>$</span>
											299 /mo
										</div>
										<h3>Estimated Cost</h3>
									</div>
								</div>
							</div>

							<div className="col grow">
								<h3>Usage this month</h3>
								<p style={{ fontSize: 13, fontWeight: 600, color: '#999' }}>Billing period: June 1 - June 30, 2018</p>

								<br />

								<div className="cluster-info">
									<div>
										<div className="price">
											<span>$</span>
											56.50
										</div>
										<h3>Payment Due</h3>
									</div>
								</div>

								<br />
								<div style={{ textAlign: 'right' }}>
									<button className="ad-theme-btn primary">Pay Now</button>
									<button className="ad-theme-btn">View Details</button>
								</div>
							</div>
						</li>

						<li className="card">
							<div className="col light">
								<h3>Invoices</h3>
								<p>For book-keeping</p>
							</div>

							<table className="invoice-table">
								<tbody>
									<tr>
										<th>Invoice-number</th>
										<th>Month</th>
										<th>Status</th>
										<th />
									</tr>
									<tr>
										<td>20983</td>
										<td>March, 2018</td>
										<td>Paid</td>
										<td><a href="#">Download</a></td>
									</tr>
									<tr>
										<td>20983</td>
										<td>March, 2018</td>
										<td>Paid</td>
										<td><a href="#">Download</a></td>
									</tr>
									<tr>
										<td>20983</td>
										<td>March, 2018</td>
										<td>Paid</td>
										<td><a href="#">Download</a></td>
									</tr>
									<tr>
										<td>20983</td>
										<td>March, 2018</td>
										<td>Paid</td>
										<td><a href="#">Download</a></td>
									</tr>
								</tbody>
							</table>
						</li>
					</ul>

				</article>
			</section>
		);
	}
}
