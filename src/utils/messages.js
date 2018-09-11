import React from 'react';

export const hoverMessage = () => (
	<div style={{ maxWidth: 220 }}>
		All appbase.io paid plans offer setting ACLs, rate limits per IP and advanced security
		permissions based on IP sources, HTTP Referers and restricting what fields are accessible.
	</div>
);
export const createCredentials = {
	email: () => <div style={{ maxWidth: 220 }}>An email to share credential key.</div>,
	description: () => (
		<div style={{ maxWidth: 220 }}>An optional description for your credential key.</div>
	),
	operationType: () => (
		<div style={{ maxWidth: 220 }}>
			Depending on the selection, the key can perform read-only, write-only or both read and
			write operations.
		</div>
	),
	acls: () => (
		<div style={{ maxWidth: 220 }}>Authorize API access to only selected operations.</div>
	),
	security: () => (
		<div style={{ maxWidth: 220 }}>
			Authorize API access based on selected HTTP Referers and IP Source values.
		</div>
	),
	referers: () => (
		<div style={{ maxWidth: 220 }}>
			Only selected HTTP Referers (aka URIs) are authorized to call the API with this
			credential.
		</div>
	),
	sources: () => (
		<div style={{ maxWidth: 220 }}>
			Only selected IP ranges (in CIDR format) are authorized to call the API with this
			credential.
		</div>
	),
	fieldFiltering: () => (
		<div style={{ maxWidth: 220 }}>
			Restrict fields that are returned when performing a search operation.
		</div>
	),
	include: () => (
		<div style={{ maxWidth: 220 }}>
			All selected fields are returned in the search response.
		</div>
	),
	exclude: () => (
		<div style={{ maxWidth: 220 }}>
			Selected fields aren't returned in the search response. In case of a field being present
			in both include and exclude, exclude has a priority.
		</div>
	),
	ttl: () => (
		<div style={{ maxWidth: 220 }}>
			Expiry time for this credential (in seconds). 0 means that it doesn't expire.
		</div>
	),
	ipLimit: (
		<div style={{ maxWidth: 220 }}>Set a per hour ratelimit on API calls per IP address.</div>
	),
};
