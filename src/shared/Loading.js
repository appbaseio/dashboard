import { default as React, Component } from 'react';

export class Loading extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="loadingContainer normal">
				<div className="loading">
					<i className="fa fa-spinner fa-spin fa-1x fa-fw" />{' '}
					<span>{this.props.text}</span>
				</div>
			</div>
		);
	}
}
