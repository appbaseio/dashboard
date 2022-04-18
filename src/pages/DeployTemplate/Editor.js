import React from 'react';
import { editorContainer } from './styles';

const Editor = ({ logs }) => {
	return (
		<div css={editorContainer}>
			{Array.isArray(logs) ? (
				logs.map(log => {
					let bgClass = '';
					if (log.level === 'WARNING') {
						bgClass = 'bg-warning';
					} else if (log.level === 'ERROR') {
						bgClass = 'bg-error';
					} else {
						bgClass = '';
					}
					return (
						<div className={`log-line ${bgClass}`}>
							<div className="log-component width">
								{log.level}&nbsp;
							</div>
							<div className="log-component width">
								{new Date(log.timestamp).toLocaleTimeString()}
								&nbsp;
							</div>
							<div className="log-component">{log.text}</div>
						</div>
					);
				})
			) : (
				<div className="log-line bg-error" style={{ paddingLeft: 15 }}>
					{logs}
				</div>
			)}
		</div>
	);
};

export default Editor;
