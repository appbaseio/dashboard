import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useMonaco } from '@monaco-editor/react';
import { Button, Card } from 'antd';
import Editor from './Editor';
import { getDeployedCluster } from '../ClusterPage/utils';
import { deployClusterStyles } from './styles';

const DeployLogs = ({ clusterId, history, showClusterDetails }) => {
	const [deployLogs, setDeployLogs] = useState([]);
	const [timeTaken, setTimeTaken] = useState(0);
	const monaco = useMonaco();

	useEffect(() => {
		getLogs();
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
					'editor.background': '#fafafa',
					'editorCursor.foreground': '#8B0000',
					'editor.lineHighlightBackground': '#C3DCFF',
					'editor.selectionBackground': '#88000030',
					'editor.inactiveSelectionBackground': '#88000015',
					'editorWarning.background': '#0000FF20',
				},
			});
		}
	}, [monaco]);

	const getLogs = () => {
		let str = '';
		getDeployedCluster('whining-businessperson-ipeehco')
			.then(res => res)
			.then(json => {
				setTimeTaken(json.time);
				setDeployLogs(json.data);
				// json.data.forEach((element, idx) => {
				// 	str += `${new Date(
				// 		element.timestamp,
				// 	).toLocaleTimeString()}  ${element.level}  ${
				// 		element.text
				// 	} \n`;
				// 	if (idx === json.data.length - 1) {
				// 		setDeployLogs(str);
				// 	}
				// });
			})
			.catch(err => {
				console.error(err);
				return JSON.stringify(err, null, 4) !== '{}'
					? setDeployLogs(JSON.stringify(json, null, 4))
					: setDeployLogs(`Error: Failed to fetch logs`);
			});
	};

	return (
		<div css={deployClusterStyles}>
			<Card
				title={
					<div className="card-title-container">
						<div>Time Taken: {timeTaken}ms </div>
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
				<Editor logsArr={deployLogs} />
				{/* <Editor
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
					value={deployLogs}
				/> */}
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
