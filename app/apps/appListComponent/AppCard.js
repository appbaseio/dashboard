import React, { Component } from 'react';
const $ = require('jquery');

export default class AppCard extends Component {
	constructor(props, context) {
		super(props);
	}

	componentDidMount() {
		setTimeout(this.setHeight, 1000);
	}

	setHeight() {
		this.maxHeight = 0;
		$('.appcard').each((index, item) => {
			this.maxHeight = this.maxHeight > $(item).height() ? this.maxHeight : $(item).height();
		});
		$('.appcard').css({height: this.maxHeight});
	}

	render() {
		return (
			<div className="col-xs-12 col-sm-6 col-md-4 appcard">
				{this.props.children}
			</div>
		);
	}
}