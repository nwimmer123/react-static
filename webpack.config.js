'use strict'

const webpack = require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'public/scripts');
const APP_DIR = path.resolve(__dirname, 'src');
const PUBLIC_DIR = path.resolve(__dirname, 'public');

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require("compresssion-webpack-plugin");
const RewactStaticPlugin = require('require-static-webpack-plugin');

const VENDOR_LIBS = [
  'react',
  'react-dom',
  'react-router',
  'react-ga'
];

const WebpackConfig = {

  entry: {
    bundle: APP_DIR + '/app.js', 
    vendor: VENDOR_LIBS
  },

  output: {
    path: PUBLIC_DIR,
    filename: 'scripts/[name].[chunkhash].js',
    chunkFilename: 'scripts/[name].[chunkhash].chunk.js',
    publicPath: '/',
  },

  module: {
    rules: [
      {
        enforce: 'pre',
        test: /.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        include : APP_DIR
      },
      {
        loader: 'babel-loader',
        test: /.js$/,
        exclude: /node_modules/,
        include : APP_DIR,
        options: {
          presets: [ ['env', {modules: false }], 'react'],
          plugins: [ 'lodash', [ 'import', { libraryName: 'antd', style: 'css'} ], 'syntax-dynamic-import' ]
        } 
      },
      {
        use: ExtractTextPlugin.extract({
          use: 'css-loader',
        }),
        test: /.css$/
      },
      {
        loader: 'json-loader',
        test: /.json$/
      }
    ],
  },

  plugins: [
    new ExtractTextPlugin({
      filename: 'style.css',
      allChunks: true
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vedor', 'manifest'],
      minChunks: Infinity,
    }),
    new HTMLWebplackPlugin({
      inject: false,
      filename: '200.html',
      template: 'scripts/200.ejs',
      minify: {
        collapseBooleanAttributes: true,
        removeComments: true,
        collapseWhitespace: true,
      }
    }),
  ],

  resolve: {
    alias: {
      app: APP_DIR,
      public: PUBLIC_DIR,
    },
    extensions: [ '.js', '.json' ]
  },

};

module.exports = WebpackConfig;