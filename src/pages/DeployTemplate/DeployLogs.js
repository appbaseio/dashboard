import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import Editor, { useMonaco } from '@monaco-editor/react';
import { Button, Card } from 'antd';
import { getDeployedCluster } from '../ClusterPage/utils';
import { deployClusterStyles } from './styles';

const DeployLogs = ({ clusterId, history }) => {
	const monaco = useMonaco();

	useEffect(() => {
		getDeployedCluster('whining-businessperson-ipeehco')
			.then(async res => await res.text())
			.then(res => console.log(res))
			.catch(err => console.error(err));
	}, []);

	useEffect(() => {
		if (monaco) {
			monaco.editor.defineTheme('customTheme', {
				base: 'vs-dark',
				inherit: false,
				rules: [
					{ token: 'WARNING', background: '#f6f5d2' },
					{ token: 'ERROR', background: 'red' },
					{ background: '000000' },
					{ foreground: 'FFFFFF' },
				],
				colors: {
					'editor.foreground': '#FFFFFF',
					'editor.background': '#000000',
					'editor.lineHighlightBackground': '#C3DCFF',
				},
			});
		}
	}, [monaco]);

	const getLogs = () => {
		let str = '';
		const convertedData = String(localStorage.getItem('logs'))
			.replace(/\n/gi, ',')
			.slice(0, -1);

		const jsonData = JSON.parse(`[${convertedData}]`);
		jsonData.forEach(element => {
			str += `${new Date(element.timestamp).toLocaleTimeString()}  ${
				element.level
			}  ${element.text} \n`;
		});
		return str;
	};

	return (
		<div css={deployClusterStyles}>
			<Card
				title={
					<div className="card-title-container">
						<div>Time Taken: ==time== </div>
						<div
							className="cluster-view-button"
							onClick={() =>
								history.push(`/clusters/${clusterId}`)
							}
						>
							View Cluster Details
						</div>
					</div>
				}
			>
				<Editor
					height="90vh"
					theme="customTheme"
					defaultLanguage="json"
					options={{
						minimap: {
							enabled: false,
						},
						fontSize: 14,
						lineHeight: 30,
						readOnly: true,
					}}
					defaultValue={getLogs()}
				/>
			</Card>
		</div>
	);
};

export default withRouter(DeployLogs);
