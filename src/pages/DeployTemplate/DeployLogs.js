import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Editor, { useMonaco } from '@monaco-editor/react';
import { Button, Card } from 'antd';
import { getDeployedCluster } from '../ClusterPage/utils';
import { deployClusterStyles } from './styles';

const DeployLogs = ({ clusterId, history, showClusterDetails }) => {
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
				base: 'vs',
				inherit: false,
				rules: [
					{ token: 'WARNING', background: '#f6f5d2' },
					{ token: 'ERROR', background: '#e51400' },
				],
				colors: {
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
						{showClusterDetails ? (
							<div
								className="cluster-view-button"
								onClick={() =>
									history.push(`/clusters/${clusterId}`)
								}
							>
								View Cluster Details
							</div>
						) : null}
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

DeployLogs.defaultProps = {
	showClusterDetails: true,
};

DeployLogs.propTypes = {
	showClusterDetails: PropTypes.bool,
};

export default withRouter(DeployLogs);
