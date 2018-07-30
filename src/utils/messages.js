import React from 'react';

export const hoverMessage = () => (
	<div style={{ maxWidth: 220 }}>
		Editing security permissions isn{"'"}t a native feature in Elasticsearch. All appbase.io
		paid plans offer editable security permissions by performing a lossless re-indexing of your
		data whenever you edit them from this UI.
	</div>
);
export const createCredentials = {
	description: () => <div style={{ maxWidth: 220 }}>description</div>,
	operationType: () => <div style={{ maxWidth: 220 }}>opt type</div>,
	acls: () => <div style={{ maxWidth: 220 }}>acl</div>,
	security: () => <div style={{ maxWidth: 220 }}>security</div>,
	referers: () => <div style={{ maxWidth: 220 }}>referes</div>,
	sources: () => <div style={{ maxWidth: 220 }}>sources</div>,
	fieldFiltering: () => (
		<div style={{ maxWidth: 220 }}>
			List of fields to retrieve (or not retrieve) when making a search query using this Api
			Key.
		</div>
	),
	include: () => <div style={{ maxWidth: 220 }}>include</div>,
	exclude: () => <div style={{ maxWidth: 220 }}>exclude</div>,
	ttl: () => <div style={{ maxWidth: 220 }}>In seconds. 0 means unlimited.</div>,
	ipLimit: (
		<div style={{ maxWidth: 220 }}>
			The maximum number of hits this API key can retrieve in one call. 0 means unlimited.
		</div>
	),
};
