import React from "react";
import classNames from "classnames";
import { billingService } from "../../service/BillingService";

const FreeHeader = (props) => {
	return (
		<div className="title">
			<span><span className="unit">$</span><span className="plan-price">0</span></span>
			<span className="superscript">
				FREE
			</span>
		</div>
	);
};

const FreeDescription = (props) => {
	return (
		<ul className="description">
			<li className="with-icon">
				<span className="icon-container">
						<img src="../../../assets/images/pricing/Icons_Pricing_10.svg" alt="" className="img-responsive" />
					</span>
				<div className="text-container">
					<div className="figure">{props.cardInfo.action}</div>
					<div className="summary">API calls</div>
				</div>
			</li>
			<li className="with-icon">
				<span className="icon-container">
						<img src="../../../assets/images/pricing/Icons_Pricing_11.png" alt="" className="img-responsive" />
					</span>
				<div className="text-container">
					<div className="figure">{props.cardInfo.records}</div>
					<div className="summary">Records</div>
				</div>
			</li>
			<li>
				<img src="../../../assets/images/pricing/PB_Appbase_Black.svg" alt="" className="img-responsive img-center" />
			</li>
			<li>
				<div className="text-container text-center">
					<div className="figure light">
						Requires <a href="/poweredby_logo_placement.zip" className="logo-link">logo <i className="fa fa-arrow-down"></i></a> placement
					</div>
				</div>
			</li>
		</ul>
	);
};

const BootstrapHeader = (props) => {
	return (
		<div className="title">
			<span><span className="unit">$</span><span className="plan-price">{billingService.prices[props.mode][props.plan]}</span></span>
			<span className="superscript">
				BOOTSTRAP
			</span>
			<span className="subscript">
				per app / month
			</span>
		</div>
	);
};

const BootstrapDescription = (props) => {
	return (
		<ul className="description">
			<li className="with-icon">
				<span className="icon-container">
						<img src="../../../assets/images/pricing/Icons_Pricing_10.svg" alt="" className="img-responsive" />
					</span>
				<div className="text-container">
					<div className="figure">{props.cardInfo.action}</div>
					<div className="summary">API calls</div>
					<div className="small-fonts">
						$5 per additional 1M API calls
					</div>
				</div>
			</li>
			<li className="with-icon">
				<span className="icon-container">
						<img src="../../../assets/images/pricing/Icons_Pricing_11.png" alt="" className="img-responsive" />
					</span>
				<div className="text-container">
					<div className="figure">{props.cardInfo.records}</div>
					<div className="summary">Records</div>
					<div className="small-fonts">
						$5 per additional 100k records
					</div>
				</div>
			</li>
			<li>
				<div className="text-container">
					<div className="big-description">
						E-mails and chat
					</div>
				</div>
			</li>
		</ul>
	);
};

const GrowthHeader = (props) => {
	return (
		<div className="title">
			<span><span className="unit">$</span><span className="plan-price">{billingService.prices[props.mode][props.plan]}</span></span>
			<span className="superscript">
				GROWTH
			</span>
			<span className="subscript">
				per app / month
			</span>
		</div>
	);
};

const GrowthDescription = (props) => {
	return (
		<ul className="description">
			<li className="with-icon">
				<span className="icon-container">
						<img src="../../../assets/images/pricing/Icons_Pricing_10.svg" alt="" className="img-responsive" />
					</span>
				<div className="text-container">
					<div className="figure">{props.cardInfo.action}</div>
					<div className="summary">API calls</div>
					<div className="small-fonts">
						$5 per additional 1M API calls
					</div>
				</div>
			</li>
			<li className="with-icon">
				<span className="icon-container">
						<img src="../../../assets/images/pricing/Icons_Pricing_11.png" alt="" className="img-responsive" />
					</span>
				<div className="text-container">
					<div className="figure">{props.cardInfo.records}</div>
					<div className="summary">Records</div>
					<div className="small-fonts">
						$5 per additional 100k records
					</div>
				</div>
			</li>
			<li>
				<div className="text-container">
					<div className="big-description list-bottom-gap">
						1:1 architecture reviews
					</div>
					<div className="big-description">
						E-mails and chat
					</div>
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
