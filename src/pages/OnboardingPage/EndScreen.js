import React from 'react';

import { endScreenStyles } from './styles';

// TODO: Add navbar
export default () => (
	<div className={endScreenStyles}>
		<div className="container">
			<div className="banner-row">
				<div className="big-card">
					<h2>WEB APP</h2>

					<div>
						<div className="col">
							<img
								src="/static/images/onboarding/finish-screen/Trophy.png"
								srcSet="/static/images/onboarding/finish-screen/Trophy.png 245w, /static/images/onboarding/finish-screen/Trophy@2x.png 490w"
								alt="Trophy"
							/>
							<p>
								You
								{"'"}
								ve finished the tutorial.
							</p>
						</div>

						<div className="col">
							<img
								style={{
									width: '150px',
								}}
								src="/static/images/onboarding/finish-screen/Webapp.png"
								srcSet="/static/images/onboarding/finish-screen/Webapp.png 245w, /static/images/onboarding/finish-screen/Webapp@2x.png 490w"
								alt="Webapp"
							/>
							<h3>Learn how to build a web app</h3>
							<p>appbase.io UI components for building data-driven web apps.</p>
							<a
								className="button"
								href="https://opensource.appbase.io/reactive-manual/getting-started/reactivesearch.html"
							>
								Get Started
							</a>
						</div>
					</div>
				</div>
				<div className="small-card">
					<h2>DASHBOARD</h2>

					<img
						style={{
							width: '150px',
							margin: '40px auto 20px',
						}}
						src="/static/images/onboarding/finish-screen/Group@3x.svg"
						alt="Dashboard"
					/>

					<p
						style={{
							fontSize: '16px',
							lineHeight: '26px',
							maxWidth: '250px',
							margin: '20px auto',
						}}
					>
						Create an app or browse your current apps via the dashboard.
					</p>
					<a
						className="button"
						href={`/dashboard/${window.location.search.split('=')[1]}`}
					>
						Go to Dashboard
					</a>
				</div>
			</div>

			<div className="card-row">
				<div className="card">
					<h2>MOBILE APP</h2>
					<img
						src="/static/images/onboarding/finish-screen/ReactiveNative.svg"
						alt="Reactive search"
					/>
					<p>appbase.io UI components for building mobile apps.</p>
					<a
						className="button"
						href="https://opensource.appbase.io/reactive-manual/native/getting-started/reactivesearch.html"
					>
						Learn More
					</a>
				</div>
				<div className="card">
					<h2>MAPS APP</h2>
					<img
						src="/static/images/onboarding/finish-screen/ReactiveMaps.svg"
						alt="Reactive maps"
					/>
					<p>appbase.io UI components for building realtime geolocation apps.</p>
					<a
						className="button"
						href="https://opensource.appbase.io/reactive-manual/getting-started/reactivemaps.html"
					>
						Learn More
					</a>
				</div>
				<div className="card">
					<h2>APIs</h2>
					<img
						width="100px"
						style={{ margin: '40px 0px 55px' }}
						src="/static/images/onboarding/finish-screen/api@3x.svg"
						alt="API"
					/>
					<p>
						Get started with the APIs for indexing, querying and streaming data with
						appbase.
					</p>
					<a
						className="button"
						href="https://docs.appbase.io/interactive/javascript.html"
					>
						Learn More
					</a>
				</div>
			</div>
		</div>
	</div>
);
