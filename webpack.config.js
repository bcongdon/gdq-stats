var path = require('path');
var APP_DIR = path.resolve(__dirname, 'js');

module.exports = {
  entry: {
    index: APP_DIR + "/index.js",
    index_react: APP_DIR + "/react/index.js"
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
          presets: ['es2015', 'react', 'stage-2']
        }
      },
      {
        test: /\.css$/,
        loader: [ 'style-loader', 'css-loader' ]
      }
    ]
  },
  devtool: '#cheap-source-map'
}
