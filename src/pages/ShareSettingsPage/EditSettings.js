import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';

class EditSettings extends React.Component {
	render() {
		console.log('THSI IS PROPS', this.props);
		return <Button style={{ border: 'none' }} icon="setting" />;
	}
}

export default connect()(EditSettings);
