const webpack = require('webpack');
const path = require('path');

module.exports = {
  devtool: '#inline-source-map',
  entry: {
    'docs.js': [
      './docs/index.jsx',
    ],
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name]',
  },
  module: {
    loaders: [
      {
        test: /\.js$/, loaders: ['babel'], exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['', '.js'],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.IgnorePlugin(/vertx/),
  ],
};
