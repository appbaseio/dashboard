// Operation types
// eslint-disable-next-line
export const Types = {
	read: {
		description: 'Read-only key',
		read: true,
		write: false,
	},
	write: {
		description: 'Write-only key',
		read: false,
		write: true,
	},
	admin: {
		description: 'Admin key',
		read: true,
		write: true,
	},
};
