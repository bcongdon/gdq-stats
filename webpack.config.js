var path = require('path');
const webpack = require('webpack');
var APP_DIR = path.resolve(__dirname, 'js');

module.exports = {
  entry: {
    index: APP_DIR + "/index.js",
  },
  output: {
    filename: "./dist/[name].bundle.js",
    chunkFilename: "./dist/[id].bundle.js"
  },
  module: {
    loaders: [
      {
        test : /\.js?/,
        include : APP_DIR,
        loader : 'babel-loader',
        query: {
          plugins: ['recharts'],
          presets: ['es2015', 'react', 'stage-2']
        }
      },
      {
        test: /\.css$/,
        loader: [ 'style-loader', 'css-loader' ]
      }
    ]
  },
  'plugins': [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ],
  devtool: '#cheap-source-map'
}
