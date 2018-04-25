import React from 'react';

import Footer from '../components/Footer';

export default props => (
	<div>
		<h2>Stream Realtime Updates</h2>
		<p>
			appbase.io has built-in support for streaming realtime updates on documents and queries.
		</p>
		<p>
			In this screen, we will index a new JSON document and see the result stream to our app UI.
		</p>
		<Footer nextScreen={props.nextScreen} />
	</div>
);
