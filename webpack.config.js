const path = require('path');
const SentryPlugin = require('@sentry/webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
	entry: path.join(__dirname, 'src/index.js'),
	output: {
		path: path.join(__dirname, 'dist'),
		publicPath: '/',
		filename: isProduction ? '[name].[contenthash].js' : '[name].js',
		chunkFilename: '[name].[contenthash].bundle.js',
	},
	plugins: isProduction
		? [
				new CleanWebpackPlugin(),
				new SentryPlugin({
					include: './dist',
					ignore: ['node_modules', 'webpack.config.js'],
					configFile: './.sentryclirc',
					debug: true,
				}),
				new webpack.EnvironmentPlugin(['CONTEXT']),
				new HtmlWebpackPlugin({
					template: path.join(__dirname, 'index.html'),
					aaaalename: 'index.html',
				}),
				new CopyWebpackPlugin([{ from: 'static', to: 'static' }, '_redirects']),
		  ]
		: [
				new CleanWebpackPlugin(),
				new webpack.EnvironmentPlugin(['CONTEXT']),
				new HtmlWebpackPlugin({
					template: path.join(__dirname, 'index.html'),
					filename: 'index.html',
				}),
				new CopyWebpackPlugin([{ from: 'static', to: 'static' }, '_redirects']),
		  ],
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
				},
			},
			{
				test: /\.less$/,
				use: [
					{
						loader: 'style-loader',
						options: {
							insertAt: 'top',
						},
					},
					{ loader: 'css-loader' },
					{
						loader: 'less-loader',
						options: {
							javascriptEnabled: true,
							modifyVars: {
								'@font-family':
									"'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Noto Sans', 'Ubuntu', 'Droid Sans', 'Helvetica Neue', sans-serif",
							},
						},
					},
				],
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.(ttf|eot|svg|png)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				use: {
					loader: 'file-loader',
				},
			},
		],
	},
};
