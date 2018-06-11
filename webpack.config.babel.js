import path from 'path';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import cssnano from 'cssnano';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import webpack from 'webpack';
import fs from 'fs';

const IS_PROD = process.env.NODE_ENV === 'production';

const generateHtmlPlugins = (templateDir) => {
	// Read files in template directory
	const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir))
	return templateFiles.map(item => {
		// Split names and extension
		const parts = item.split('.')
		const name = parts[0]
		const extension = parts[1]
		// Create new HTMLWebpackPlugin with options
		return new HTMLWebpackPlugin({
			filename: `${name}.html`,
			template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`)
		})
	})
};

const htmlPlugins = generateHtmlPlugins('./src/templates/views');

const config = {
	context: path.resolve(__dirname, 'src'),
	mode: process.env.NODE_ENV,
	devtool: IS_PROD ? 'source-map' : 'cheap-module-eval-source-map',
	devServer: {
		historyApiFallback: true,
		hot: true,
		inline: true,
		index: 'index.html',
		stats: 'errors-only',
	},
	entry: {
		main: './index.js'
	},
	module: {
		rules: [{
			test: /\.pug$/,
			exclude: ['/node_modules/'],
			use: {
        loader: 'pug-loader',
        options: {
          pretty: true
        }
      }
		}, {
			test: /\.js$/,
			exclude: /node_modules/,
			use: {
				loader: 'babel-loader'
			}
		}, {
			test: /\.css$/,
			exclude: /node_modules/,
			use: [
				MiniCssExtractPlugin.loader,
				'css-loader',
				'postcss-loader'
			],
		}, {
			test: /\.scss$/,
			exclude: /node_modules/,
			use: [
				MiniCssExtractPlugin.loader,
				{
					loader: 'css-loader',
					options: {
						sourceMap: IS_PROD
					}
				}, {
					loader: 'postcss-loader',
				}, {
					loader: 'sass-loader',
					options: {
						sourceMap: IS_PROD
					}
				}
			],
		}]
	},
	output: {
		filename: IS_PROD ? '[name].[hash:6].js' : '[name].js',
		path: path.resolve(__dirname, 'dist'),
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin({
			multistep: true
		}),
		new MiniCssExtractPlugin({
			filename: IS_PROD ? '[name].[hash:6].css' : '[name].css',
		})
	].concat(htmlPlugins)
};

if (IS_PROD) {
	config.plugins.push(
		// new UglifyJSPlugin(),
		// new OptimizeCssAssetsPlugin()
		new CleanWebpackPlugin(['dist']),
		new OptimizeCSSAssetsPlugin({
			cssProcessor: cssnano,
			cssProcessorOptions: {
				discardComments: {
					removeAll: true,
				},
				safe: true
			},
			canPrint: false,
		}),
	);
}

module.exports = config;
