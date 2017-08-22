var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
	    'underscore': resolve('src/assets/js/underscore.min.js')
    }
  },
  module: {
    rules: [
//      {
//        test: /\.(js|vue)$/,
//        loader: 'eslint-loader',
//        enforce: 'pre',
//        include: [resolve('src'), resolve('test')],
//        options: {
//          formatter: require('eslint-friendly-formatter')
//        }
//      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
        {
            test: /\.scss$/,
            use: [
                'style-loader',
                'css-loader?modules',
                'sass-loader',
            ],
        },
        {
            test: /\.less$/,
            use: [
                'style-loader',
                'css-loader?modules',
                'less-loader',
            ],
        },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}
