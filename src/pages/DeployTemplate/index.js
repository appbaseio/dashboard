import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Alert, Icon, Tabs, Row, Col, Link, Button } from 'antd';
import { mainContainer } from './styles';
import DeployCluster from './DeployCluster';
import PipelineTemplateScreen from './PipelineTemplateScreen';
import ErrorPage from './ErrorPage';
import DeployLogs from './DeployLogs';
import Loader from '../../components/Loader';
import FullHeader from '../../components/FullHeader';
import Header from '../../components/Header';

const yaml = require('js-yaml');
const { TabPane } = Tabs;

const DeployTemplate = ({ location }) => {
	const [response, setResponse] = useState('');
	const [initialFormData, setInitialFormData] = useState({});
	const [formData, setFormData] = useState({});
	const [activeKey, setActiveKey] = useState(
		localStorage.getItem('currentStep') || '1',
	);
	const [err, setErr] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [tabsValidated, setTabsValidated] = useState(
		JSON.parse(localStorage.getItem('validatedTabs')) || {
			tab1: false,
			tab2: false,
			tab3: false,
		},
	);
	const [clusterId, setClusterId] = useState('');

	useEffect(() => {
		if (location.search) {
			const dataUrl = location.search.split('=')[1];
			fetch(dataUrl)
				.then(res => res.text())
				.then(resp => {
					let json = yaml.load(resp);
					setInitialFormData(json);
					const transformedFormData = {
						...json,
						global_vars: [...ValidateObj(json?.global_vars || [])],
					};
					if (!localStorage.getItem(dataUrl)) {
						setFormData(transformedFormData);
						localStorage.setItem(
							dataUrl,
							JSON.stringify(transformedFormData),
						);
					} else {
						setFormData(JSON.parse(localStorage.getItem(dataUrl)));
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
				// newPipelineVariable[key].match(regex) -> returns array of ${variable} available in the string
				newPipelineVariable[key].match(regex).map(data => {
					// Extract variable from ${variable}
					const keyVariable = varRegex.exec(data)[1];
					const reqObject = pipelineVariables.filter(
						i => i.key === keyVariable,
					);
					const newRegex = `\${${keyVariable}}`;

					newPipelineVariable[key] = newPipelineVariable[key].replace(
						newRegex,
						reqObject[0].value,
					);
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

	const handleFormChange = (key, val) => {
		const dataUrl = location.search.split('=')[1];
		const newFormData = { ...initialFormData };
		newFormData?.global_vars.forEach(data => {
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
		const transformedFormData = {
			...formData,
			global_vars: [...ValidateObj(newFormData?.global_vars || [])],
		};
		setFormData(transformedFormData);
		localStorage.setItem(dataUrl, JSON.stringify(transformedFormData));
	};

	const handleTabChange = tab => {
		setActiveKey(tab);
		localStorage.setItem('currentStep', tab);
	};

	if (isLoading) return <Loader />;

	return (
		<div>
			<FullHeader isCluster />
			<div css={mainContainer}>
				<Header compact>
					<Row type="flex" justify="space-between" gutter={16}>
						<Col lg={18}>
							<h2>Deploy Reactivesearch Cluster</h2>

							<Row>
								<Col lg={18}>
									<p>
										You're using the deploy template
										feature. Once you fill the variables for
										this pipeline template, your cluster
										will get deployed in just 2mins.
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
								<Icon type="book" /> Read more
							</Button>
						</Col>
					</Row>
				</Header>
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
								tab="1 Enter Pipeline Template variables"
								key="1"
							>
								<PipelineTemplateScreen
									formData={formData.global_vars || []}
									setActiveKey={handleTabChange}
									handleFormChange={handleFormChange}
									tabsValidated={tabsValidated}
									setTabsValidated={val => {
										const newTabsValidated = {
											...tabsValidated,
											tab1: val,
										};
										setTabsValidated(newTabsValidated);
										localStorage.setItem(
											'validatedTabs',
											JSON.stringify(newTabsValidated),
										);
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
									setClusterId={setClusterId}
									setActiveKey={handleTabChange}
									setTabsValidated={val => {
										const newTabsValidated = {
											...tabsValidated,
											tab2: val,
										};
										setTabsValidated(newTabsValidated);
										localStorage.setItem(
											'validatedTabs',
											JSON.stringify(newTabsValidated),
										);
									}}
								/>
							</TabPane>
							<TabPane
								tab="Cluster Deploy Logs"
								// disabled={!tabsValidated.tab2}
								key="3"
							>
								<DeployLogs clusterId={clusterId} />
							</TabPane>
						</Tabs>
					)}
				</div>
			</div>
		</div>
	);
};

export default withRouter(DeployTemplate);
