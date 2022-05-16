import React from 'react';
import { editorContainer } from './styles';

const Editor = ({ logs, setIsError }) => {
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
					if (
						!log.timestamp &&
						!log.level &&
						log.detail &&
						logs.length === 1
					) {
						setIsError(true);
						return (
							<div className={`log-line ${bgClass}`}>
								<div className="log-component">
									No logs found...!!!
								</div>
							</div>
						);
					} else {
						return (
							<div className={`log-line ${bgClass}`}>
								<div className="log-component width">
									{log.level}&nbsp;
								</div>
								<div className="log-component width">
									{new Date(
										log.timestamp,
									).toLocaleTimeString()}
									&nbsp;
								</div>
								<div className="log-component">{log.text}</div>
							</div>
						);
					}
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
