import React from 'react';
import { machineMarks } from './NewMyCluster';
import { priceSlider } from './NewMyCluster';
import PricingSlider from './components/PricingSlider/MyClusterSlider';
import { regions, regionsByPlan } from './utils/regions';
import { namingConvention } from './NewMyCluster';
import { clusterContainer } from './styles';

const createCluster = ({
	showError,
	handleError,
	isUsingClusterTrial,
	pricing_plan,
	pricingPlan,
	setPricing,
	clusters,
	renderRegions,
	isInvalid,
	isInvalidURL,
	clusterName,
	setConfig,
	setChanged,
	changed,
	clusterURL,
	handleVerify,
	verifyingURL,
	clusterVersion,
	urlErrorMessage,
}) => {
	// const renderRegions = () => {
	// 	const provider = 'gke';
	// 	const allowedRegions = regionsByPlan[provider][pricingPlan];

	// 	const asiaRegions = Object.keys(regions[provider]).filter(
	// 		item => regions[provider][item].continent === 'asia',
	// 	);
	// 	const euRegions = Object.keys(regions[provider]).filter(
	// 		item => regions[provider][item].continent === 'eu',
	// 	);
	// 	const usRegions = Object.keys(regions[provider]).filter(
	// 		item => regions[provider][item].continent === 'us',
	// 	);
	// 	const otherRegions = Object.keys(regions[provider]).filter(
	// 		item => !regions[provider][item].continent,
	// 	);

	// 	const regionsToRender = data =>
	// 		data.map(region => {
	// 			const regionValue = regions[provider][region];
	// 			const isDisabled = allowedRegions
	// 				? !allowedRegions.includes(region)
	// 				: false;
	// 			return (
	// 				// eslint-disable-next-line
	// 				<li
	// 					key={region}
	// 					onClick={() => this.setConfig('region', region)}
	// 					className={
	// 						// eslint-disable-next-line
	// 						isDisabled
	// 							? 'disabled'
	// 							: this.state.region === region
	// 							? 'active'
	// 							: ''
	// 					}
	// 				>
	// 					{regionValue.flag && (
	// 						<img
	// 							src={`/static/images/flags/${regionValue.flag}`}
	// 							alt={regionValue.name}
	// 						/>
	// 					)}
	// 					<span>{regionValue.name}</span>
	// 				</li>
	// 			);
	// 		});

	// 	const style = { width: '100%' };
	// 	if (provider === 'azure') {
	// 		return (
	// 			<ul style={style} className="region-list">
	// 				{regionsToRender(Object.keys(regions[provider]))}
	// 			</ul>
	// 		);
	// 	}

	// 	return (
	// 		<Tabs size="large" style={style}>
	// 			<TabPane tab="America" key="america">
	// 				<ul className="region-list">
	// 					{regionsToRender(usRegions)}
	// 				</ul>
	// 			</TabPane>
	// 			<TabPane tab="Asia" key="asia">
	// 				<ul className="region-list">
	// 					{regionsToRender(asiaRegions)}
	// 				</ul>
	// 			</TabPane>
	// 			<TabPane tab="Europe" key="europe">
	// 				<ul className="region-list">
	// 					{regionsToRender(euRegions)}
	// 				</ul>
	// 			</TabPane>
	// 			<TabPane tab="Other Regions" key="other">
	// 				<ul className="region-list">
	// 					{regionsToRender(otherRegions)}
	// 				</ul>
	// 			</TabPane>
	// 		</Tabs>
	// 	);
	// };

	return (
		<div>
			<section className={clusterContainer}>
				{showError ? handleError() : null}
				<article>
					<div className={card}>
						<div className="col light">
							<h3>Pick the pricing plan</h3>
							<p>Scale as you go</p>
							{isUsingClusterTrial ? (
								<p>
									<b>Note: </b>You can only create{' '}
									{machineMarks[pricing_plan].label} Cluster
									while on trial.
								</p>
							) : null}
						</div>

						<PricingSlider
							sliderProps={{
								disabled: isUsingClusterTrial,
							}}
							marks={priceSlider}
							onChange={setPricing}
							showNoCardNeeded={
								isUsingClusterTrial && clusters.length < 1
							}
						/>
					</div>

					<div className={card}>
						<div className="col light">
							<h3>Pick a region</h3>
							<p>All around the globe</p>
						</div>
						<div className="col grow region-container">
							{renderRegions()}
						</div>
					</div>

					<div className={card}>
						<div className="col light">
							<h3>Choose a cluster name</h3>
							<p>Name your cluster. A name is permanent.</p>
						</div>
						<div
							className="col grow vcenter"
							css={{
								flexDirection: 'column',
								alignItems: 'flex-start !important',
								justifyContent: 'center',
							}}
						>
							<input
								id="cluster-name"
								type="name"
								css={{
									width: '100%',
									maxWidth: 400,
									marginBottom: 10,
									outline: 'none',
									border:
										isInvalid && clusterName !== ''
											? '1px solid red'
											: '1px solid #40a9ff',
								}}
								placeholder="Enter your cluster name"
								value={clusterName}
								onChange={e => {
									setChanged(true);
									setConfig('clusterName', e.target.value);
								}}
							/>
							{!changed && (
								<p style={{ color: 'orange' }}>
									This is an auto-generated cluster name. You
									can edit this.
								</p>
							)}
							<p
								style={{
									color:
										isInvalid && clusterName !== ''
											? 'red'
											: 'inherit',
								}}
							>
								{namingConvention.gke}
							</p>
						</div>
					</div>

					<div className={card}>
						<div className="col light">
							<h3>Connect to your ElasticSearch Cluster</h3>
							<p>Enter your Cluster credentials and username</p>
						</div>
						<div
							className="col grow vcenter"
							css={{
								flexDirection: 'column',
								alignItems: 'flex-start !important',
								justifyContent: 'center',
							}}
						>
							<input
								id="elastic-url"
								type="name"
								css={{
									width: '100%',
									maxWidth: 400,
									marginBottom: 10,
									outline: 'none',
									border:
										isInvalidURL && clusterURL !== ''
											? '1px solid red'
											: '1px solid #e8e8e8',
								}}
								placeholder="Enter your Elastic URL"
								value={clusterURL}
								onChange={e =>
									setConfig('clusterURL', e.target.value)
								}
							/>
							<Button
								onClick={handleVerify}
								disabled={clusterURL}
								loading={verifyingURL}
							>
								Verify Connection
							</Button>

							{verifiedCluster ? (
								<Tag style={{ marginTop: 10 }} color="green">
									Verified Connection. Version Detected:{' '}
									{clusterVersion}
								</Tag>
							) : null}

							{isInvalidURL ? (
								<p
									style={{
										color: 'red',
									}}
								>
									{urlErrorMessage === 'Auth Error' ? (
										<React.Fragment>
											We received a authentication error.
											Does your ElasticSearch require
											additional authentication? Read more{' '}
											<a
												target="_blank"
												rel="noopener noreferrer"
												href="https://docs.appbase.io/docs/hosting/BYOC/ConnectToYourElasticSearch"
											>
												here
											</a>
											.
										</React.Fragment>
									) : (
										urlErrorMessage
									)}
								</p>
							) : null}
						</div>
					</div>
				</article>
			</section>
		</div>
	);
};
