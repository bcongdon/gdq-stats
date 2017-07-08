var path = require('path');
const webpack = require('webpack');
var APP_DIR = path.resolve(__dirname, 'js');

module.exports = {
  entry: {
    index: APP_DIR + "/index.js",
    graph: APP_DIR + "/graph.js",
    chat: APP_DIR + "/ChatApp.js",
    donations: APP_DIR + "/DonationsApp.js",
    animals: APP_DIR + "/AnimalsApp.js",
    games: APP_DIR + "/GamesApp.js"
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
