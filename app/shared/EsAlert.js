import React from 'react';
import AlertBox from './AlertBox';

const EsAlert = (props) => {
	const alertBoxInfo = {
		title: (<span>Admin credential missing</span>),
		description: (
			<p>
				Admin credential is missing on this app, create new credential to continue.
			</p>
		),
		type: "danger"
	};
	return (
		<AlertBox {...alertBoxInfo}></AlertBox>
	);
};

export default EsAlert;