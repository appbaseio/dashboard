import React from 'react';
import AlertBox from './AlertBox';

const EsAlert = props => {
	const alertBoxInfo = {
		title: <span>Missing Credentials</span>,
		description: (
			<div>
				<p>
					We can't find an admin type credentials key for this app, this might affect the
					browsing experience in the current view.
				</p>
				<p>
					You can create new credentials <a href="/credentials">here</a>.
				</p>
			</div>
		),
		type: 'danger',
	};
	return <AlertBox {...alertBoxInfo} />;
};

export default EsAlert;
