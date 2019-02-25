import React from 'react';
import ReactDOM from 'react-dom';

class Frame extends React.Component {
	constructor(props) {
		super(props);
		const { id } = props;
		this.iframeRef = React.createRef(`iframe-${id}`);
	}

	componentDidMount() {
		const iframeNode = ReactDOM.findDOMNode(this.iframeRef.current);
		iframeNode.addEventListener('load', this.props.onLoad);
	}

	render() {
		const { id, onLoad, ...rest } = this.props;
		return <iframe ref={this.iframeRef} title={id} {...rest} />;
	}
}

export default Frame;
