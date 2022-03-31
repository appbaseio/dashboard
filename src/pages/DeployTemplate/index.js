import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Input, Icon, Button, Tooltip } from 'antd';
import { deployClusterStyles } from './styles';
import { isArray } from 'lodash';
const yaml = require('js-yaml');

const obj = [
	{
		description: '<p><p>',
		key: 'ES_CREDS',
		label: 'Elasticsearch Creds',
		value: 'https://demo-appbase.io',
	},
	{
		description: 'This is the Elasticsearch URL. Read more over here',
		key: 'ES_URL',
		label: 'Elasticsearch URL',
	},
	{
		key: 'KNOWLEDGE_GRAPH_API_KEY',
		label: 'Knowledge Graph API Key',
		validate: [
			{
				expected_status: 204,
				headers: 'JSON',
				method: 'POST',
				url: 'https://my-url/${ES_URL}/',
			},
		],
	},
];

const DeployTemplate = ({ location }) => {
	const [response, setResponse] = useState('');

	useEffect(() => {
		if (location.search) {
			// const dataUrl = location.search.split('=')[1];
			let dataUrl =
				'https://raw.githubusercontent.com/appbaseio/pipelines-template/master/basic/pipeline.yaml';
			fetch(dataUrl)
				.then(res => res.text())
				.then(resp => {
					let res = `---
                    global_vars:
                      -
                        description: <p><p>
                        key: ES_CREDS
                        label: "Elasticsearch Creds"
                        value: "https://demo-appbase.io"
                      -
                        description: "This is the Elasticsearch URL. Read more over here"
                        key: ES_URL
                        label: "Elasticsearch URL"
                      -
                        key: KNOWLEDGE_GRAPH_API_KEY
                        label: "Knowledge Graph API Key"
                        validate:
                          -
                            expected_status: 204
                            headers: JSON
                            method: POST
                            url: "https://my-url/{ES_URL}/"
                    `;
					let json = yaml.load(res);
					for (const data in json) {
						if (json.hasOwnProperty(data)) {
							if (isArray(json[data])) {
								console.log(json[data]);
							}
						}
					}
				});
		}
	}, []);

	const validateInput = validateObj => {
		// fetch call
		// response set to state
	};

	return (
		<div css={deployClusterStyles}>
			{obj.map(data => (
				<div key={data.key} style={{ padding: 20 }}>
					<div className="title-container">
						{data.label}
						{data.description ? (
							<Tooltip title={data.description}>
								<span style={{ marginLeft: 5 }}>
									<Icon type="info-circle" />
								</span>
							</Tooltip>
						) : null}
					</div>
					<div>
						<Input value={data.value} className="input-container" />
						{data.validate ? (
							<Button
								type="primary"
								onClick={validateInput(data.validate)}
								className="validate-button"
							>
								validate
							</Button>
						) : null}
						{/* error ? <div>Expected status is {data.validate.expected_status}, but received {response.status}</div> */}
					</div>
				</div>
			))}
			<Button
				className="deploy-button"
				size="small"
				block
				data-cy="signin-button"
			>
				Deploy Cluster
			</Button>
		</div>
	);
};

export default withRouter(DeployTemplate);
