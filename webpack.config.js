var path = require('path');
var webpack = require('webpack');

module.exports = {
	context: path.resolve(__dirname, "app"),
	entry: {
		main: "./routes.js"
	},
	output: {
		path: path.resolve(__dirname, "dist/js"),
		filename: "app.js",
		publicPath: "/dist/js/"
	},
	module: {
		rules: [
			{
				test: /.jsx?$/,
				loader: "babel-loader",
				exclude: /node_modules/
			},
			{ test: /\.css$/, loader: "style-loader!css-loader" },
			{ test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
			{ test: /\.(ttf|eot|svg|png)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
		]
	}
};
