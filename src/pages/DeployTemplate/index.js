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
	const [activeKey, setActiveKey] = useState('1');
	const [err, setErr] = useState(false);

	useEffect(() => {
		if (location.search) {
			const dataUrl = location.search.split('=')[1];
			fetch(dataUrl)
				.then(res => res.text())
				.then(resp => {
					let json = yaml.load(resp);
					const transformedFormData = {
						...json,
						global_vars: [...ValidateObj(json?.global_vars || [])],
					};
					setFormData(transformedFormData);
					setErr(false);
				})
				.catch(e => {
					console.error(e);
					setErr(true);
				});
		}
	}, []);

	const transformValidateObj = (
		pipelineVariable,
		regex,
		varRegex,
		pipelineVariables,
		type = 'other',
		...attrs
	) => {
		let newPipelineVariable = { ...pipelineVariable };
		if (type === 'array') {
			newPipelineVariable = { ...pipelineVariable[0] };
		}

		// object traversal to find ${variable}
		for (const key in newPipelineVariable) {
			if (typeof newPipelineVariable[key] === 'object') {
				if (Array.isArray(newPipelineVariable[key])) {
					newPipelineVariable[key] = transformValidateObj(
						newPipelineVariable[key],
						regex,
						varRegex,
						pipelineVariables,
						'array',
					);
				} else {
					newPipelineVariable[key] = transformValidateObj(
						newPipelineVariable[key],
						regex,
						varRegex,
						pipelineVariables,
					);
				}
			} else if (
				typeof newPipelineVariable[key] === 'string' &&
				newPipelineVariable[key].match(regex)
			) {
				// Check if ${variable} pattern exists
				// Extract variable from ${variable}
				const keyVariable =
					varRegex.exec(newPipelineVariable[key])[1] || '';
				const reqObject = pipelineVariables.filter(
					i => i.key === keyVariable,
				);
				newPipelineVariable[key] = newPipelineVariable[key].replace(
					regex,
					reqObject[0].value,
				);
			}
		}
		return newPipelineVariable;
	};

	const ValidateObj = pipelineVariables => {
		const regex = /\${[a-zA-Z0-9_]*}/gm;
		const varRegex = /(?<=\${)(.*?)(?=\})/;

		const newArr = pipelineVariables.map(pipelineVariable => {
			const newPipelineVariable = transformValidateObj(
				pipelineVariable,
				regex,
				varRegex,
				pipelineVariables,
			);
			return newPipelineVariable;
		});
		return newArr;
	};

	return err ? (
		<ErrorPage />
	) : (
		<Tabs defaultActiveKey="1" activeKey={activeKey}>
			<TabPane tab="Enter Pipeline Template variables" key="1">
				<PipelineTemplateScreen
					formData={formData.global_vars || []}
					setActiveKey={setActiveKey}
				/>
			</TabPane>
			<TabPane tab="Deploy Cluster" disabled={activeKey === '1'} key="2">
				<DeployCluster formData={formData} />
			</TabPane>
		</Tabs>
	);
};

export default withRouter(DeployTemplate);
