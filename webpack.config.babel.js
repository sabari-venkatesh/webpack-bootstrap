import path from 'path';
import webpack from 'webpack';
import fs from 'fs';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import cssnano from 'cssnano';
import CopyWebpackPlugin from 'copy-webpack-plugin';

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
      title: `Praesto - ${name}`,
      chunks: ['vendor', 'app', `${name}`],
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`)
    })
  })
};

const htmlPlugins = generateHtmlPlugins('./src/templates/views');

const config = {
  context: path.resolve(__dirname, 'src'),
  mode: process.env.NODE_ENV,
  devtool: IS_PROD ? 'source-map' : false,
  devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true,
    index: 'index.html',
    stats: 'errors-only',
  },
  entry: {
    app: './scripts/app.js',
    sales: './scripts/sales.js'
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
      test: /\.(s*)css$/,
      exclude: /node_modules/,
      use: [MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1
          }
        },
        {
          loader: 'postcss-loader',
          options: {
            plugins: [
              require('autoprefixer'),
              //require('stylelint')
            ]
          }
        }, {
          loader: 'sass-loader'
        }
      ],
    }, {
      test: /\.(png|jpg)$/,
      exclude: /node_modules/,
      use: {
        loader: 'file-loader',
        options: {
          name: 'images/[name].[ext]',
          publicPath: '/'
        }
      }
    }, {
      test: /\.(ttf|eot|woff|woff2)$/,
      use: {
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]',
          publicPath: '../'
        }
      },
    }]
  },
  output: {
    filename: IS_PROD ? 'scripts/[name].[hash:6].js' : 'scripts/[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'initial',
          minSize: 0,
          minChunks: 3
        },
      },
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      Util: 'exports-loader?Util!bootstrap/js/dist/util',
      Tooltip: 'exports-loader?Tooltip!bootstrap/js/dist/tooltip',
      Popper: ['popper.js', 'default']
    }),
    new webpack.HotModuleReplacementPlugin({
      multistep: true
    }),
    new MiniCssExtractPlugin({
      filename: IS_PROD ? 'styles/[name].[hash:6].css' : 'styles/[name].css',
    }),
    new CopyWebpackPlugin([{
      from: 'images',
      to: 'images'
    }, {
      from: 'data',
      to: 'data'
    }])
  ].concat(htmlPlugins)
};

if (IS_PROD) {
  config.plugins.push(
    // new UglifyJSPlugin(),
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
    })
  );
}

module.exports = config;
