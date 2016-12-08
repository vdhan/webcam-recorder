var webpack = require('webpack');

var env = new webpack.DefinePlugin({
	"process.env": {
		NODE_ENV: JSON.stringify("production")
	}
});

var common = new webpack.optimize.CommonsChunkPlugin('common.js');

var config = {
	entry: {
		app: './jsx/app.js' // must have prefix "./"
	},

	output: {
		path: 'static/js',
		filename: '[name].js'
	},

	plugins: [env, common],

	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',

				query: {
					presets: ['es2015', 'react']
				}
			}
		]
	},

	resolve: {
		extensions: ['', '.js']
	}
};

module.exports = config;