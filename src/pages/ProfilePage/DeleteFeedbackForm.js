import React, { useEffect } from 'react';
import { createWidget } from '@typeform/embed';
import '@typeform/embed/build/css/widget.css';

function DeleteFeedbackForm({ setIsFeedbackSubmitted }) {
	useEffect(() => {
		createWidget('yVrwbYTw', {
			container: document.querySelector('#typeform-embed-container'),
			onSubmit: event => {
				setIsFeedbackSubmitted(true);
			},
		});
	}, []);

	return <div id="typeform-embed-container" style={{ height: 580 }}></div>;
}

export default DeleteFeedbackForm;
