const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: ['promise-polyfill',  'whatwg-fetch', 'dialog-polyfill', './src/index.js'],
  output: {
    path: path.resolve(__dirname, "docs"),
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        loader: 'style-loader'
      },
      {
        test: /\.css$/,
        loader: 'css-loader',
        query: {
          modules: true,
          localIdentName: '[name]__[local]___[hash:base64:5]'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.json']
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({ output: {comments: false} }),
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' })
  ]
};
