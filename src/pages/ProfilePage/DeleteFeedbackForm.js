import React from 'react';
import { Widget } from '@typeform/embed-react';

const DeleteFeedbackForm = ({ setIsFeedbackSubmitted }) => {
	return (
		<Widget
			id="QEktta"
			style={{ width: '100%', height: '100%' }}
			className="my-form"
			onSubmit={() => {
				setIsFeedbackSubmitted(true);
			}}
		/>
	);
};

export default DeleteFeedbackForm;
