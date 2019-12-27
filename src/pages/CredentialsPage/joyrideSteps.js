import React from 'react';

const joyrideSteps = [
	{
		content: (
			<span>
				Create a new API credential for your app. Advanced security
				features are available when you upgrade to a paid plan.
			</span>
		),
		target: '.credentials-tutorial-1',
		placement: 'bottom',
	},
	{
		content: (
			<span>
				Edit the permissions associated with this API credential.
			</span>
		),
		target: '.credentials-tutorial-2',
		placement: 'bottom',
	},
	{
		content: (
			<span>
				<b>Read-only</b> credentials are meant to be used on your public
				facing app.
			</span>
		),
		target: '.credentials-tutorial-3',
		placement: 'bottom',
	},
	{
		content: (
			<span>
				<b>Write</b> credentials can modify data in your app, and should
				only be used from secure environments.
			</span>
		),
		target: '.credentials-tutorial-4',
		placement: 'bottom',
	},
];

export default joyrideSteps;
