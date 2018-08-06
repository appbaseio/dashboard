import React from 'react';
import classNames from 'classnames';
import { billingService } from '../../service/BillingService';

const FreeHeader = props => {
	return (
		<div className="title">
			<span>
				<span className="unit">$</span>
				<span className="plan-price">0</span>
			</span>
			<span className="superscript">FREE</span>
		</div>
	);
};

const FreeDescription = props => {
	return (
		<ul className="description">
			<li className="with-icon">
				<span className="icon-container">
					<img
						src="../../../assets/images/pricing/calls.png"
						alt=""
						className="img-responsive"
					/>
				</span>
				<div className="text-container">
					<div className="figure flex">
						{props.cardInfo.action}
						<div className="summary">&nbsp;API calls</div>
					</div>
				</div>
			</li>
			<li className="with-icon">
				<span className="icon-container">
					<img
						src="../../../assets/images/pricing/records.png"
						alt=""
						className="img-responsive"
					/>
				</span>
				<div className="text-container">
					<div className="figure flex">
						{props.cardInfo.records}
						<div className="summary">&nbsp;Records</div>
					</div>
				</div>
			</li>
			<li>
				<img
					src="../../../assets/images/pricing/PB_Appbase_Black.svg"
					alt=""
					className="img-responsive appbase-logo img-center"
				/>
			</li>
			<li>
				<div className="text-container text-center">
					<div className="figure light">
						<a href="https://appbase.io/static/poweredby_logo_placement.zip" className="logo-link">
							<i className="fa fa-arrow-down" /> Requires logo placement
						</a>
					</div>
				</div>
			</li>
		</ul>
	);
};

const BootstrapHeader = props => {
	return (
		<div className="title">
			<span>
				<span className="unit">$</span>
				<span className="plan-price">{billingService.prices[props.mode][props.plan]}</span>
			</span>
			<span className="superscript">BOOTSTRAP</span>
			<span className="subscript">per app / month</span>
		</div>
	);
};

const BootstrapDescription = props => {
	return (
		<ul className="description">
			<li className="with-icon">
				<span className="icon-container">
					<img
						src="../../../assets/images/pricing/calls.png"
						alt=""
						className="img-responsive"
					/>
				</span>
				<div className="text-container">
					<div className="figure flex">
						{props.cardInfo.action}
						<div className="summary">&nbsp;API calls</div>
					</div>
					<div className="small-fonts">
						$5 per additional <br /> 1M API calls
					</div>
				</div>
			</li>
			<li className="with-icon">
				<span className="icon-container">
					<img
						src="../../../assets/images/pricing/records.png"
						alt=""
						className="img-responsive"
					/>
				</span>
				<div className="text-container">
					<div className="figure flex">
						{props.cardInfo.records}
						<div className="summary">&nbsp;Records</div>
					</div>
					<div className="small-fonts">
						$5 per additional <br /> 50k records
					</div>
				</div>
			</li>
			<li>
				<div className="text-container">
					<div className="big-description">E-mails and chat</div>
				</div>
			</li>
		</ul>
	);
};

const GrowthHeader = props => {
	return (
		<div className="title">
			<span>
				<span className="unit">$</span>
				<span className="plan-price">{billingService.prices[props.mode][props.plan]}</span>
			</span>
			<span className="superscript">GROWTH</span>
			<span className="subscript">per app / month</span>
		</div>
	);
};

const GrowthDescription = props => {
	return (
		<ul className="description">
			<li className="with-icon">
				<span className="icon-container">
					<img
						src="../../../assets/images/pricing/calls.png"
						alt=""
						className="img-responsive"
					/>
				</span>
				<div className="text-container">
					<div className="figure flex">
						{props.cardInfo.action}
						<div className="summary">&nbsp;API calls</div>
					</div>
					<div className="small-fonts">
						$50 per additional <br /> 10M API calls
					</div>
				</div>
			</li>
			<li className="with-icon">
				<span className="icon-container">
					<img
						src="../../../assets/images/pricing/records.png"
						alt=""
						className="img-responsive"
					/>
				</span>
				<div className="text-container">
					<div className="figure flex">
						{props.cardInfo.records}
						<div className="summary">&nbsp;Records</div>
					</div>
					<div className="small-fonts">
						$50 per additional <br /> 1M records
					</div>
				</div>
			</li>
			<li>
				<div className="text-container">
					<div className="big-description list-bottom-gap">1:1 architecture reviews</div>
					<div className="big-description">E-mails and chat</div>
				</div>
			</li>
		</ul>
	);
};

module.exports = {
	FreeHeader,
	FreeDescription,
	BootstrapHeader,
	BootstrapDescription,
	GrowthHeader,
	GrowthDescription,
};
