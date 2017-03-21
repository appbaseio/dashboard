import React,{ Component } from 'react';
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
				confirm: this.props.closeBtn
			}
		};
	}
	render() {
		return (
			<ConfirmBox
				info={this.setConfirmBoxInfo()}
				type={this.props.type}
				showModal={true}
			>
			</ConfirmBox>
		)
	}
}

AlertBox.propTypes = {
	title: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.element
	]),
	description: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.element
	]),
	closeBtn: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.element
	]),
	type: React.PropTypes.string
};

// Default props value
AlertBox.defaultProps = {
	closeBtn: "close"
}
