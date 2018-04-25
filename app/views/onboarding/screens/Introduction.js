import React from 'react';

import Footer from '../components/Footer';

export default props => (
	<div>
		<h2>Import data from anywhere into your app</h2>
		<p>
			An app in appbase.io is equivalent to an index in Elasticsearch (or like a database in SQL).
		</p>
		<p>
			// Pick your unique app name &lt;input box>
		</p>
		<p>
			There are three ways to bring your data into appbase.io:
			<br/>
			1. Dashboard - GUI for importing JSON / CSV.
			<br/>
			2. A CLI for bringing data from most popular databases.
			<br/>
			3. Using the REST API for indexing the data.
		</p>
		{
			props.hasJSON
				? (<iframe src="https://opensource.appbase.io/dejavu/live/#?input_state=XQAAAALuAAAAAAAAAAA9iIqnY-B2BnTZGEQz6wkFsoHwhgU_KtNrMjzBE3XTtIB6C0opQ-fxBl0alZl_n8Ug8uMW3y_Oz2gNQxJYcrwjjxYOYNXrtoZj0XB6k8Mu3c-3sHc0xzLrqVzwM2LOKgA5ZtpNvs6Kid7NFNgfJnjGMZfik3FM2Ytu1n8ijcazsD2-Nm97JmQNFisp6Rx_aiwKkXXdujPU8XUYSVg12MX2BJAHkvn7HwxLS-xBYaBLHgrDIv_rvN-VhoY0hr-NbIn_8KeAAA&amp;hf=false&amp;subscribe=false" height="600px" width="100%" frameBorder="0"></iframe>)
				: (<a style={{ marginTop: 40 }} onClick={props.importJSON} className="button">Import JSON</a>)
		}

		<Footer nextScreen={props.nextScreen} disabled={!props.hasJSON} />
	</div>
);
