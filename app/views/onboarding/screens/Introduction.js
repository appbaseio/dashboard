import React from 'react';

import Footer from '../components/Footer';

export default props => (
	<div>
		<h2>Import data from anywhere into Elasticsearch</h2>
		<p>
			Lorem ipsum dolor sit amet consectetur, adipisicing elit.
			Delectus deleniti saepe iusto distinctio et obis autem labore quasi sequi
			ipsum sapiente voluptatum enim nihil!
		</p>

		{
			props.hasJSON
				? (<iframe src="https://opensource.appbase.io/dejavu/live/#?input_state=XQAAAALuAAAAAAAAAAA9iIqnY-B2BnTZGEQz6wkFsoHwhgU_KtNrMjzBE3XTtIB6C0opQ-fxBl0alZl_n8Ug8uMW3y_Oz2gNQxJYcrwjjxYOYNXrtoZj0XB6k8Mu3c-3sHc0xzLrqVzwM2LOKgA5ZtpNvs6Kid7NFNgfJnjGMZfik3FM2Ytu1n8ijcazsD2-Nm97JmQNFisp6Rx_aiwKkXXdujPU8XUYSVg12MX2BJAHkvn7HwxLS-xBYaBLHgrDIv_rvN-VhoY0hr-NbIn_8KeAAA&amp;hf=false&amp;subscribe=false" height="600px" width="100%" frameBorder="0"></iframe>)
				: (<a style={{ marginTop: 40 }} onClick={props.importJSON} className="button">Import JSON</a>)
		}

		<Footer nextScreen={props.nextScreen} disabled={!props.hasJSON} />
	</div>
);
