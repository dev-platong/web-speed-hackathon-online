'use strict';

const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

module.exports = (env, { mode }) => {
  return {
    entry: path.resolve(__dirname, 'src', 'app.js'),

    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].bundle.js',
      publicPath: '/',
    },

    resolve: {
      extensions: ['.js', '.jsx'],
    },

    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'process.env.USE_MOCK_DATA': JSON.stringify(process.env.USE_MOCK_DATA),
      }),
      new HtmlWebpackPlugin({
        title: 'Amida Blog: あみぶろ',
        template: path.resolve(__dirname, 'src', 'index.html'),
      }),
    ],

    module: {
      rules: [
        {
          test: /\.m?jsx?$/,
          use: {
            loader: 'babel-loader',
          },
          exclude: /node_modules/,
        },
        {
          test: /\.(png|svg|jpe?g|gif)$/,
          use: {
            loader: 'url-loader',
          },
        },
      ],
    },

    optimization: {
      usedExports: true,
    },

    target: 'web',

    devtool: 'source-map',

    mode,
  };
};
