import React, { Component } from 'react';
import Nav from '../../shared/Nav';

export default class EndScreen extends Component {
	render() {
		return (
			<div className="end-screen">
				<Nav />

				<div className="container">
					<div className="banner-row">
						<div className="big-card">
							<h2>WEB APP</h2>

							<div>
								<div className="col">
									<img
										src="/assets/images/onboarding/finish-screen/Trophy.png"
										srcSet="/assets/images/onboarding/finish-screen/Trophy.png 245w, /assets/images/onboarding/finish-screen/Trophy@2x.png 490w"
										alt="Trophy"
									/>
									<p>You've finished the tutorial</p>
								</div>

								<div className="col">
									<img
										style={{
											width: '150px'
										}}
										src="/assets/images/onboarding/finish-screen/Webapp.png"
										srcSet="/assets/images/onboarding/finish-screen/Webapp.png 245w, /assets/images/onboarding/finish-screen/Webapp@2x.png 490w"
										alt="Webapp"
									/>
									<h3>Learn how to build a web app.</h3>
									<p>A React UI components library for building Airbnb / Yelp like search interfaces.</p>
									<a className="button" href="https://opensource.appbase.io/reactivesearch">Get Started</a>
								</div>
							</div>
						</div>
						<div className="small-card">
							<h2>Browse your app or create a new one via the main dashboard.</h2>
							<a style={{ marginTop: '40px' }} className="button" href="/">Go to Dashboard</a>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
