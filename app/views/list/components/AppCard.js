import React, { Component } from 'react';

export default function AppCard(props) {
	const cx = props.setClassName ? props.setClassName : "";
	return (
		<div className={`col-xs-12 col-sm-6 col-md-4 appcard ${cx}`}>
			{props.children}
		</div>
	)
}