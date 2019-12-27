import React, { Component } from 'react';

export default class Clusters extends Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	render() {
		const vcenter = {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			height: 'calc(100vh - 200px)',
			width: '100%',
			fontSize: '18px',
		};

		return (
			<div style={vcenter}>
				<i
					className="fas fa-money-check-alt"
					style={{ fontSize: 38 }}
				/>
				<h2>Free to use</h2>
				<p>Clusters are free to use while in preview</p>
			</div>
		);
	}

	// render() {
	// 	return (
	// 		<section className="cluster-container container">
	// 			<article>
	// 				<h2>Clusters Billing</h2>

	// 				<ul className="clusters-list">
	// 					<li className="card">
	// 						<div className="col light">
	// 							<h3>Active pricing plan</h3>
	// 							<p>Production II</p>
	// 						</div>

	// 						<div className="col grey">
	// 							<div className="cluster-info">
	// 								<div className="cluster-info__item">
	// 									<div>
	// 										10 GB
	// 									</div>
	// 									<div>Storage (SSD)</div>
	// 								</div>
	// 								<div className="cluster-info__item">
	// 									<div>
	// 										120 GB
	// 									</div>
	// 									<div>Memory</div>
	// 								</div>
	// 								<div className="cluster-info__item">
	// 									<div>
	// 										3 Nodes
	// 									</div>
	// 									<div>HA</div>
	// 								</div>
	// 							</div>
	// 							<div className="cluster-info">
	// 								<div>
	// 									<div className="price">
	// 										<span>$</span>
	// 										299 /mo
	// 									</div>
	// 									<h3>Estimated Cost</h3>
	// 								</div>
	// 							</div>
	// 						</div>

	// 						<div className="col grow">
	// 							<h3>Usage this month</h3>
	// 							<p style={{ fontSize: 13, fontWeight: 600, color: '#999' }}>Billing period: June 1 - June 30, 2018</p>

	// 							<br />

	// 							<div className="cluster-info">
	// 								<div>
	// 									<div className="price">
	// 										<span>$</span>
	// 										56.50
	// 									</div>
	// 									<h3>Payment Due</h3>
	// 								</div>
	// 							</div>

	// 							<br />
	// 							<div style={{ textAlign: 'right' }}>
	// 								<button className="ad-theme-btn primary">Pay Now</button>
	// 								<button className="ad-theme-btn">View Details</button>
	// 							</div>
	// 						</div>
	// 					</li>

	// 					<li className="card">
	// 						<div className="col light">
	// 							<h3>Invoices</h3>
	// 							<p>For book-keeping</p>
	// 						</div>

	// 						<table className="invoice-table">
	// 							<tbody>
	// 								<tr>
	// 									<th>Invoice-number</th>
	// 									<th>Month</th>
	// 									<th>Status</th>
	// 									<th />
	// 								</tr>
	// 								<tr>
	// 									<td>20983</td>
	// 									<td>March, 2018</td>
	// 									<td>Paid</td>
	// 									<td><a href="#">Download</a></td>
	// 								</tr>
	// 								<tr>
	// 									<td>20983</td>
	// 									<td>March, 2018</td>
	// 									<td>Paid</td>
	// 									<td><a href="#">Download</a></td>
	// 								</tr>
	// 								<tr>
	// 									<td>20983</td>
	// 									<td>March, 2018</td>
	// 									<td>Paid</td>
	// 									<td><a href="#">Download</a></td>
	// 								</tr>
	// 								<tr>
	// 									<td>20983</td>
	// 									<td>March, 2018</td>
	// 									<td>Paid</td>
	// 									<td><a href="#">Download</a></td>
	// 								</tr>
	// 							</tbody>
	// 						</table>
	// 					</li>
	// 				</ul>

	// 			</article>
	// 		</section>
	// 	);
	// }
}
