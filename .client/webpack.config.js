var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  //entry: [
  //  'webpack-dev-server/client?http://localhost:3000',
  //  'webpack/hot/only-dev-server',
  //  './index'
  //],
  entry: [
    './index'
  ],
  output: {
    path: path.join(__dirname, '..', 'client'),
    filename: 'bundle.js'
  },
  //plugins: [
  //  new webpack.HotModuleReplacementPlugin(),
  //  new webpack.NoErrorsPlugin()
  //],
  resolve: {
    extensions: ['', '.js']
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      exclude: /node_modules/
    }, {
      test: /\.css?$/,
      loaders: ['style', 'raw']
    },{
      test: /\.vue$/, 
      loader: "vue-loader"
    }]
  }
};
