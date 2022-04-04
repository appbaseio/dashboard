import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Alert, Icon, Tabs } from 'antd';
import { deployClusterStyles } from './styles';
import DeployCluster from './DeployCluster';
import PipelineTemplateScreen from './PipelineTemplateScreen';
import ErrorPage from './ErrorPage';

const yaml = require('js-yaml');
const { TabPane } = Tabs;

const DeployTemplate = ({ location }) => {
	const [response, setResponse] = useState('');
	const [formData, setFormData] = useState({});
	const [err, setErr] = useState(false);

	let res = `
	---
id: 'geo-search'
description: 'This is a geo search template'
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
    value: "sample"
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

	useEffect(() => {
		if (location.search) {
			// const dataUrl = location.search.split('=')[1];
			let dataUrl =
				'https://raw.githubusercontent.com/appbaseio/pipelines-template/master/basic/pipeline.yaml';
			fetch(dataUrl)
				.then(res => res.text())
				.then(resp => {
					let json = yaml.load(res);
					setFormData(json);
					setErr(false);
				})
				.catch(e => {
					console.error(e);
					setErr(true);
				});
		}
	}, []);

	return err ? (
		<ErrorPage />
	) : (
		<Tabs defaultActiveKey="1">
			<TabPane tab="Enter Pipeline Template variables" key="1">
				<PipelineTemplateScreen formData={formData} />
			</TabPane>
			<TabPane tab="Deploy Cluster" disabled={false} key="2">
				<DeployCluster formData={formData} />
			</TabPane>
		</Tabs>
	);
};

export default withRouter(DeployTemplate);
