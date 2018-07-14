
var path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const metaInfo = {
	'charset': "utf-8",
	'http-equiv': "X-UA-Compatible",
	'content': "IE=edge",
	'name': "viewport",
	'content': "width=device-width, initial-scale=1",
}

module.exports = {

	mode: 'development',
	watch: true,
	target: 'web',

	entry: {
		'd3-dmec-chart.worker': './src/workers/d3-dmec-chart.worker.ts',
		'xpd-timers.worker': './src/workers/xpd-timers.worker.ts',
		'admin': './src/app/admin/admin.ts',
		// 'dmeclog': './src/dmec-log/dmeclog.ts',
		// 'reports': './src/reports/reports.ts',
		'operation-view-only': './src/app/operation-view-only/operation-view-only.ts',
		'well-view-only': './src/app/well-view-only/well-view-only.ts',
	},

	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name]/[name].js'
	},

	plugins: [

		new HtmlWebpackPlugin({
			title: 'XPD Admin',
			chunks: ['admin'],
			template: './src/app/admin/index.html',
			filename: 'admin.html',
			meta: metaInfo,
			favicon: './src/assets/img/favicon.ico'
		}),

		new HtmlWebpackPlugin({
			title: 'Operation Settings Overview',
			chunks: ['operation-view-only'],
			template: './src/app/operation-view-only/index.html',
			filename: 'operation-view-only.html',
			meta: metaInfo,
			favicon: './src/assets/img/favicon.ico'
		}),

		new HtmlWebpackPlugin({
			title: 'Well Settings Overview',
			chunks: ['well-view-only'],
			template: './src/app/well-view-only/index.html',
			filename: 'well-view-only.html',
			meta: metaInfo,
			favicon: './src/assets/img/favicon.ico'
		}),

		new CopyWebpackPlugin([{
			from: 'src/js/**/*',
			to: 'assets/js',
		}],
			{ debug: true })
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

			// {
			//   loader: 'worker-loader',
			//   options: { publicPath: '/workers/' },
			// }

			// {
			//   test: /\.worker\.js$/,
			//   use: { loader: 'worker-loader' }
			// },

			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				loader: "ts-loader"
			},

			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: "babel-loader"
			},

			{
				test: /\.html$/,
				exclude: /node_modules/,
				loader: "html-loader?exportAsEs6Default"
			},

			// {
			// 	test: /\.tsx?$/,
			// 	use: 'ts-loader',
			// 	exclude: /node_modules/
			// },

			// {
			// 	test: /\.(html)$/,
			// 	use: {
			// 		loader: 'html-loader',
			// 		options: {
			// 			attrs: [':data-src']
			// 		}
			// 	}
			// },

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
		historyApiFallback: true,
		watchOptions: { aggregateTimeout: 300, poll: 1000 },
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
			"Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
		},
	},

	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.json', '.html', '.css']
	},

	devtool: 'inline-source-map',
	// devtool: 'source-map'

}

