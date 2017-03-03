import React, { Component } from 'react';
const $ = require('jquery');

export default class AppCard extends Component {
	constructor(props, context) {
		super(props);
	}

	render() {
		return (
			<div className="col-xs-12 col-sm-6 col-md-4 appcard">
				{this.props.children}
			</div>
		);
	}
}