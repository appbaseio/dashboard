import React from 'react';
import PricingSlider from './components/PricingSlider';

export default () => (
	<section className="cluster-container container">
		<article>
			<h2>Create a new cluster</h2>
			<div className="card">
				<div className="col light">
					<h3>Pick the pricing plan</h3>
					<p>Scale as you go</p>
				</div>

				<PricingSlider
					marks={{
						0: {
							label: 'Sandbox',
							storage: 30,
							memory: 1,
							nodes: 1,
							cost: 49,
						},
						25: {
							label: 'Hobby',
							storage: 60,
							memory: 2,
							nodes: 2,
							cost: 99,
						},
						50: {
							label: 'Production I',
							storage: 120,
							memory: 4,
							nodes: 3,
							cost: 199,
						},
						75: {
							label: 'Production II',
							storage: 240,
							memory: 8,
							nodes: 3,
							cost: 299,
						},
						100: {
							label: 'Production III',
							storage: 512,
							memory: 16,
							nodes: 3,
							cost: 499,
						},
					}}
				/>
			</div>

			<div className="card">
				<div className="col light">
					<h3>Pick a region</h3>
					<p>All around the globe</p>
				</div>
				<div className="col grow region-container">
					<ul className="region-list">
						<li className="active">
							<img src="/assets/images/flags/united-states.png" alt="US" />
							<span>East US</span>
						</li>
						<li>
							<img src="/assets/images/flags/united-states.png" alt="US" />
							<span>Central US</span>
						</li>
						<li>
							<img src="/assets/images/flags/europe.png" alt="EU" />
							<span>West Europe</span>
						</li>
					</ul>
					<ul className="region-list">
						<li>
							<img src="/assets/images/flags/canada.png" alt="CA" />
							<span>Canada Central</span>
						</li>
						<li>
							<img src="/assets/images/flags/canada.png" alt="CA" />
							<span>Canada East</span>
						</li>
					</ul>
				</div>
			</div>

			<div className="card">
				<div className="col light">
					<h3>Pick a cluster name</h3>
					<p>Name this bad boy</p>
				</div>
				<div className="col grow vcenter">
					<input type="name" className="form-control" placeholder="Enter your cluster name" />
				</div>
			</div>

			<div className="card">
				<div className="col light">
					<h3>Additional Settings</h3>
					<p>Customise as per your needs</p>
				</div>
				<div className="col grow">
					<div className="settings-item">
						<h4>Select a version</h4>
						<select className="form-control">
							<option>6.3</option>
							<option>6.2</option>
							<option>6.1</option>
							<option>6.0</option>
							<option>5.6</option>
							<option>5.5</option>
							<option>5.4</option>
							<option>5.3</option>
							<option>5.2</option>
						</select>
					</div>

					<div className="settings-item">
						<h4>Kibana</h4>
						<div className="form-check">
							<label htmlFor="yes">
								<input type="radio" name="kibana" value="" id="yes" />
								Yes
							</label>

							<label htmlFor="no">
								<input type="radio" name="kibana" value="" id="no" />
								No
							</label>
						</div>
					</div>

					<div className="settings-item">
						<h4>Logstash</h4>
						<div className="form-check">
							<label htmlFor="yes2">
								<input type="radio" name="logstash" value="" id="yes2" />
								Yes
							</label>

							<label htmlFor="no2">
								<input type="radio" name="logstash" value="" id="no2" />
								No
							</label>
						</div>
					</div>

					<div className="settings-item">
						<h4>Plugins</h4>
						<div className="form-check">
							<label htmlFor="dejavu">
								<input type="checkbox" value="" id="dejavu" />
								Dejavu
							</label>

							<label htmlFor="elasticsearch">
								<input type="checkbox" value="" id="elasticsearch" />
								Elasticsearch-HQ
							</label>

							<label htmlFor="mirage">
								<input type="checkbox" value="" id="mirage" />
								Mirage
							</label>
						</div>
					</div>
				</div>
			</div>

			<div style={{ textAlign: 'right', marginBottom: 40 }}>
				<button className="ad-theme-btn primary">
					Create Cluster &nbsp; &nbsp;
					<i className="fas fa-arrow-right" />
				</button>
			</div>
		</article>
	</section>
);
