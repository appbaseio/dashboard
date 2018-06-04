import React from 'react';
import classNames from 'classnames';

export default function Header(props) {
	const cx = {
		monthly: classNames({
			active: props.mode === 'monthly',
		}),
		annual: classNames({
			active: props.mode === 'annual',
		}),
	};
	return (
		<section className="container-fluid" id="top-container">
			<div className="row">
				<div className="pricing-top col-xs-12">
					<div className="container">
						<div className="row">
							<h1 className="col-xs-12">Pricing Plans</h1>
						</div>
						<div className="row">
							<div className="toggleButton">
								<button
									className={`btn left monthly ${cx.monthly}`}
									onClick={() => props.changePlan('monthly')}
								>
									Monthly
								</button>
								<button
									className={`btn right monthly ${cx.annual}`}
									onClick={() => props.changePlan('annual')}
								>
									Annual
								</button>
							</div>
							{props.customer ? (
								<p className="col-xs-12 plan-bottomline">
									You are currently subscribed to the {props.customer.mode}{' '}
									{props.customer.plan} plan.
								</p>
							) : null}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
