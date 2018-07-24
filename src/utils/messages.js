import React from 'react';

export const hoverMessage = () => (
	<div style={{ maxWidth: 220 }}>
		Editing security permissions isn{"'"}t a native feature in Elasticsearch. All appbase.io
		paid plans offer editable security permissions by performing a lossless re-indexing of your
		data whenever you edit them from this UI.
	</div>
);

export const fieldMessage = () => (
	<div style={{ maxWidth: 220 }}>
		List of fields to retrieve (or not retrieve) when making a search query using this Api Key.
	</div>
);
export const ttlMessage = () => <div style={{ maxWidth: 220 }}>In seconds. 0 means unlimited.</div>;
export const ipLimitMessage = () => (
	<div style={{ maxWidth: 220 }}>
		The maximum number of hits this API key can retrieve in one call. 0 means unlimited.
	</div>
);
