import React, { Component } from 'react';

export default function AppCard(props) {
	return (
		<div className={`col-xs-12 col-sm-6 col-md-4 appcard ${props.setClassName}`}>
			{props.children}
		</div>
	)
}