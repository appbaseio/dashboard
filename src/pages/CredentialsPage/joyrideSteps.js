import React from 'react';

const joyrideSteps = [
	{
		content: (
			<span>
				This option is used to create new Credentials but you need to be on paid plan for
				adding advanced security permissions.
			</span>
		),
		target: '.credentials-tutorial-1',
		placement: 'bottom',
	},
	{
		content: (
			<span>
				This option is used to edit exisiting Credentials permissions but you need to be on
				paid plan for adding advanced security permissions.
			</span>
		),
		target: '.credentials-tutorial-2',
		placement: 'bottom',
	},
	{
		content: (
			<span>
				<b>Read-only</b> credentials is only use to read the data from app and cannot modify
				data present on the app, it is best to use read credentials when you are just
				displaying the data.
			</span>
		),
		target: '.credentials-tutorial-3',
		placement: 'bottom',
	},
	{
		content: (
			<span>
				<b>Write</b> credentials can modify data in your app, do not use them in code that
				runs in the web browser. Instead, generate read-only credentials.
			</span>
		),
		target: '.credentials-tutorial-4',
		placement: 'bottom',
	},
];

export default joyrideSteps;
