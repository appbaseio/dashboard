import React from 'react';

const DashboardGettingStarted = (props) => {
	return (
		<div className="ad-dashboard-getting-started-container row">
			<div className="col-xs-12 col-sm-6">
				<section className="ad-detail-page-body-card getting-started col-xs-12 p-0">
					<header className="ad-detail-page-body-card-title col-xs-12">
						Tutorial
					</header>
					<main className="ad-detail-page-body-card-body col-xs-12">
						<p>
							Try out the interactive tutorial for adding your first data to the app.
						</p>
					</main>
				</section>
			</div>
			<div className="col-xs-12 col-sm-6">
				<section className="ad-detail-page-body-card getting-started col-xs-12 p-0">
					<header className="ad-detail-page-body-card-title col-xs-12">
						Onboarding Guides
					</header>
					<main className="ad-detail-page-body-card-body col-xs-12">
						<p>
							Check out our onboarding guides for how to use the APIs for adding data.
						</p>
					</main>
				</section>
			</div>
		</div>
	);
}
export default DashboardGettingStarted;
