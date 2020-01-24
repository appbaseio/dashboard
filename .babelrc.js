const presets = [
	'@babel/preset-flow',
	'@babel/preset-react',
	[
		'@babel/env',
		{
			targets: {
				edge: '17',
				firefox: '60',
				chrome: '67',
				safari: '11.1',
			},
			useBuiltIns: 'usage',
			corejs: 2,
		},
	],
];

const plugins = [
	'emotion',
	'@babel/plugin-proposal-class-properties',
	'syntax-dynamic-import',
	['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }],
];

module.exports = { presets, plugins };
