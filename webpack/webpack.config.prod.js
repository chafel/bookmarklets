'use strict';

const Path = require('path');
const Webpack = require('webpack');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const common = require('./webpack.common.js');
var ghpages = require('gh-pages');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  stats: 'errors-only',
  optimization: {
    minimize: true
  },
  plugins: [
    new Webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    // compiling mode “scope hoisting”
    new Webpack.optimize.ModuleConcatenationPlugin(),
    new MiniCssExtractPlugin({
      filename: 'bundle.css'
    }),
    {
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
            ghpages.publish('dist', function(err) {
              process.stderr.write(err);
            });

            process.stdout.write('published');
        });
      }
    }
  ],
  resolve: {
    alias: {
      '~': Path.resolve(__dirname, '../src')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /(node_modules|bower_components)/,
        use: 'babel-loader'
      },
      {
        test: /\.s?css/i,
        use : [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  }
});
