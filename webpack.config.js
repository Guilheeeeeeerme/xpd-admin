
var path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {

	mode: 'development',
	watch: true,

	entry: {
		// 'admin': './src/admin/admin.ts',
		// 'dmeclog': './src/dmec-log/dmeclog.ts',
		// 'reports': './src/reports/reports.ts',
		'operation-view-only': './src/app/operation-view-only/operation-view-only.ts',
		'well-view-only': './src/app/well-view-only/well-view-only.ts',
	},

	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name]/[name].bundle.js'
	},

	plugins: [
		new HtmlWebpackPlugin({
			title: 'Operation Settings Overview',
			chunks: ['operation-view-only'],
			filename: 'operation-view-only.html',
			// template: './src/app/operation-view-only/index.html',
			meta: {
				'charset': "utf-8",
				'http-equiv': "X-UA-Compatible",
				'content': "IE=edge",
				'name': "viewport",
				'content': "width=device-width, initial-scale=1",
			},
			favicon: './src/assets/img/favicon.ico'
		}),
		
		new HtmlWebpackPlugin({
			title: 'Well Settings Overview',
			chunks: ['well-view-only'],
			filename: 'well-view-only.html',
			// template: './src/app/well-view-only/index.html',
			meta: {
				'charset': "utf-8",
				'http-equiv': "X-UA-Compatible",
				'content': "IE=edge",
				'name': "viewport",
				'content': "width=device-width, initial-scale=1",
			},
			favicon: './src/assets/img/favicon.ico'
		})
	],

	// plugins: [
	// 	new webpack.ProvidePlugin({
	// 		jQuery: 'jquery',
	// 		$: 'jquery',
	// 		jquery: 'jquery'
	// 	})
	// ],

	module: {
		rules: [

			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			},

			{
				test: /\.(html)$/,
				use: {
					loader: 'html-loader',
					options: {
						attrs: [':data-src']
					}
				}
			},

			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},

			{
				test: /\.(png|woff|woff2|eot|ttf|svg)$/,
				loader: 'url-loader?limit=100000'
			}

		]

	},

	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		compress: true,
		port: 9000,
	},

	devtool: 'source-map'

}

