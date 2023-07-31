import React, { useEffect, useRef, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { BookOutlined } from '@ant-design/icons';
import { Tabs, Row, Col, Button } from 'antd';
import { mainContainer } from './styles';
import DeployCluster from './DeployCluster';
import PipelineTemplateScreen from './PipelineTemplateScreen';
import ErrorPage from './ErrorPage';
import Loader from '../../components/Loader';
import FullHeader from '../../components/FullHeader';
import Header from '../../components/Header';
import { ACC_API } from '../../batteries/utils';

const yaml = require('js-yaml');

const { TabPane } = Tabs;

const DeployTemplate = ({ location }) => {
	const hasMounted = useRef(false);
	const [templateUrl, setTemplateUrl] = useState('');
	const [initialFormData, setInitialFormData] = useState({});
	const [formData, setFormData] = useState({});
	const [activeKey, setActiveKey] = useState('1');
	const [err, setErr] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [tabsValidated, setTabsValidated] = useState({
		tab1: false,
		tab2: false,
		tab3: false,
	});
	const [clusterId, setClusterId] = useState('');
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
		// eslint-disable-next-line no-restricted-syntax
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
				// newPipelineVariable[key].match(regex) -> returns array of ${variable} available in the string
				newPipelineVariable[key].match(regex).map(data => {
					// Extract variable from ${variable}
					const keyVariable = varRegex.exec(data)[1];
					const reqObject = pipelineVariables.filter(
						i => i.key === keyVariable,
					);
					const newRegex = `\${${keyVariable}}`;

					if (reqObject[0]) {
						newPipelineVariable[key] = newPipelineVariable[
							key
						].replace(newRegex, reqObject[0].value);
					}
				});
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
	const getFormData = (dataUrl, overrideStaleData = false) => {
		fetch(dataUrl)
			.then(res => res.text())
			.then(resp => {
				const json = yaml.load(resp);
				setInitialFormData(json);
				const transformedFormData = {
					...json,
					global_envs: [...ValidateObj(json?.global_envs || [])],
				};
				if (
					!localStorage.getItem(dataUrl.split('=')[1]) ||
					overrideStaleData
				) {
					setFormData(transformedFormData);
					localStorage.setItem(
						dataUrl.split('=')[1],
						JSON.stringify({
							formData: transformedFormData,
							currentStep: '1',
							validatedTabs: {
								tab1: false,
								tab2: false,
								tab3: false,
							},
							clusterId: '',
						}),
					);
				} else {
					const deployTemplateData = JSON.parse(
						localStorage.getItem(dataUrl.split('=')[1]),
					);
					setFormData(deployTemplateData.formData);
					setActiveKey(deployTemplateData.currentStep);
					setTabsValidated(deployTemplateData.validatedTabs);
					setClusterId(deployTemplateData.clusterId);
					setIsLoading(false);
				}
				setErr('');
				setIsLoading(false);
			})
			.catch(e => {
				setIsLoading(false);
				console.error(e);
				if (e.stack) {
					setErr(e.message);
				} else {
					setErr(
						'This repository may not exist or is set to private.',
					);
				}
			});
	};
	const formInit = () => {
		const dataUrl = `${ACC_API}/v2/raw-github?path=${window.location.search
			.split('=')[1]
			.replace('https://raw.githubusercontent.com/', '')}`;
		setTemplateUrl(dataUrl.split('=')[1]);
		getFormData(dataUrl, !hasMounted.current);
	};
	useEffect(() => {
		if (location.search) {
			formInit();
			hasMounted.current = true;
		}
	}, [location]);

	const handleFormChange = (key, val) => {
		const newFormData = { ...initialFormData };
		// eslint-disable-next-line no-unused-expressions
		newFormData?.global_envs.forEach(data => {
			if (data.key === key) {
				data.value = val;
				if (
					data.validate &&
					data.validate.method &&
					data.validate.method !== 'GET'
				) {
					data.validate = {
						...data.validate,
						body: JSON.stringify({ [key]: val }),
					};
				}
			}
		});
		setInitialFormData(newFormData);
		const newDeployTemplateData = {
			...JSON.parse(localStorage.getItem(templateUrl)),
		};
		const transformedFormData = {
			...formData,
			global_envs: [...ValidateObj(newFormData?.global_envs || [])],
		};
		setFormData(transformedFormData);
		newDeployTemplateData.formData = transformedFormData;
		localStorage.setItem(
			templateUrl,
			JSON.stringify(newDeployTemplateData),
		);
	};

	const handleTabChange = tab => {
		setActiveKey(tab);
		const newDeployTemplateData = {
			...JSON.parse(localStorage.getItem(templateUrl)),
		};
		newDeployTemplateData.currentStep = tab;
		console.log('templateUrl', templateUrl);
		localStorage.setItem(
			templateUrl,
			JSON.stringify(newDeployTemplateData),
		);
	};

	const handleValidatedTabs = (key, val) => {
		const newTabsValidated = {
			...tabsValidated,
			[key]: val,
		};
		setTabsValidated(newTabsValidated);
		const newDeployTemplateData = {
			...JSON.parse(localStorage.getItem(templateUrl)),
		};
		newDeployTemplateData.validatedTabs = newTabsValidated;
		localStorage.setItem(
			templateUrl,
			JSON.stringify(newDeployTemplateData),
		);
	};

	const handleClusterId = id => {
		setClusterId(id);
		const newDeployTemplateData = {
			...JSON.parse(localStorage.getItem(templateUrl)),
		};
		newDeployTemplateData.clusterId = id;
		localStorage.setItem(
			templateUrl,
			JSON.stringify(newDeployTemplateData),
		);
	};

	if (isLoading) return <Loader />;

	return (
		<div>
			<FullHeader isCluster />
			<div css={mainContainer}>
				<Header compact>
					<Row type="flex" justify="space-between" gutter={16}>
						<Col lg={18}>
							<h2>Deploy Pipeline with ReactiveSearch</h2>

							<Row>
								<Col lg={18}>
									<p>
										You&lsquo;re using the deploy template
										feature. Once you fill in the variables
										for this pipeline template, your cluster
										will get deployed in &lt; 2 mins.
									</p>
								</Col>
							</Row>
						</Col>
						<Col
							lg={6}
							css={{
								display: 'flex',
								flexDirection: 'column-reverse',
								paddingBottom: 20,
							}}
						>
							<Button
								size="large"
								type="primary"
								block
								style={{ width: 150 }}
							>
								<BookOutlined /> Read more
							</Button>
						</Col>
					</Row>
				</Header>
				{formData?.description && (
					<h3 style={{ margin: '2rem 0' }}>
						Deploying: &quot;{formData?.description}&quot;
					</h3>
				)}
				<div className="tab-container">
					{err ? (
						<ErrorPage message={err} />
					) : (
						<Tabs
							defaultActiveKey="1"
							activeKey={activeKey}
							onTabClick={e => handleTabChange(e)}
						>
							<TabPane
								tab="1 Enter Pipeline Template Environments"
								key="1"
							>
								<PipelineTemplateScreen
									formData={formData?.global_envs || []}
									setActiveKey={handleTabChange}
									handleFormChange={handleFormChange}
									tabsValidated={tabsValidated}
									setTabsValidated={val => {
										handleValidatedTabs('tab1', val);
									}}
								/>
							</TabPane>
							<TabPane
								tab="2 Deploy Cluster"
								disabled={!tabsValidated.tab1}
								key="2"
							>
								<DeployCluster
									formData={formData}
									location={location}
									setClusterId={handleClusterId}
									setActiveKey={handleTabChange}
									setTabsValidated={val => {
										handleValidatedTabs('tab2', val);
									}}
								/>
							</TabPane>

							{/* <TabPane
								tab="3 Cluster Deploy Logs"
								disabled={!tabsValidated.tab2}
								key="3"
							>
								<DeployLogs
									clusterId={clusterId}
									dataUrl={templateUrl}
								/>
							</TabPane> */}
						</Tabs>
					)}
				</div>
			</div>
		</div>
	);
};

export default withRouter(DeployTemplate);
