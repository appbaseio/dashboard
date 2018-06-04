import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ConfirmBox from './ConfirmBox';

export default class AlertBox extends Component {
	constructor(props) {
		super(props);
	}
	setConfirmBoxInfo() {
		return {
			title: this.props.title,
			description: this.props.description,
			buttons: {
				confirm: this.props.closeBtn,
			},
		};
	}
	render() {
		return (
			<ConfirmBox info={this.setConfirmBoxInfo()} type={this.props.type} showModal={true} />
		);
	}
}

AlertBox.propTypes = {
	title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
	description: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
	closeBtn: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
	type: PropTypes.string,
};

// Default props value
AlertBox.defaultProps = {};
