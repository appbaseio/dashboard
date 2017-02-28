var path = require('path');
var webpack = require('webpack');

module.exports = {
	entry: path.join(__dirname, 'src', 'app/app.js'),
	output: {
		path: path.join(__dirname, 'src', 'src/dist/js'),
		publicPath: '/dist/js/',
		filename: 'app.js'
	},
	devServer: {
		inline: true,
		port: 8000,
		contentBase: "src/",
		historyApiFallback: {
			index: '/index.html'
		}
	},
	module: {
		preLoaders: [
			{ test: /\.json$/, exclude: /node_modules/, loader: 'json' },
		],
		loaders: [{
				test: /.jsx?$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				query: {
					presets: ['es2015', 'stage-0', 'react']
				}
			}, {
				test: /node_modules\/JSONStream\/index\.js$/,
				loaders: ['shebang', 'babel']
			}, { test: /\.css$/, loader: "style-loader!css-loader" },
			{ test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
			{ test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
		]
	},
};
