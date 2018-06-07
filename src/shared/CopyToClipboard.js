import React, { Component } from 'react';
import Clipboard from 'clipboard';

export default class CopyToClipboard extends Component {
	constructor(props) {
		super(props);
		this.getRef = this.getRef.bind(this);
	}
	componentWillUnmount() {
		if (this.cp) {
			this.cp.destroy();
		}
	}
	getRef(item) {
		if (item) {
			const credId = item;
			if (this.cp) {
				this.cp.destroy();
			}
			this.cp = new Clipboard(credId);
			this.cp.on('success', this.props.onSuccess);
			this.cp.on('error', this.props.onError);
		}
	}
	render() {
		const childrenWithProps = React.Children.map(this.props.children, child =>
			React.cloneElement(child, {
				ref: this.getRef,
			}),
		);
		return <span>{childrenWithProps}</span>;
	}
}

CopyToClipboard.propTypes = {};

// Default props value
CopyToClipboard.defaultProps = {};
