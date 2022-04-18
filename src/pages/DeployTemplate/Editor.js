import React from 'react';
import { editorContainer } from './styles';

const Editor = ({ logsArr }) => {
	return (
		<div css={editorContainer}>
			{logsArr.map(log => {
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
							{new Date(log.timestamp).toLocaleTimeString()}&nbsp;
						</div>
						<div className="log-component">{log.text}</div>
					</div>
				);
			})}
		</div>
	);
};

export default Editor;
