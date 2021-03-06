import path from 'path';
import webpack from 'webpack';

const entryFile = 'js/main.js';
const PATHS = {
  source: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'build')
};

const webpackConfig = {
  common: {
    debug: true,
    context: PATHS.source,
    resolve: {
      extensions: ['', '.js', '.jsx']
    },
    output: {
      path: PATHS.build,
      publicPath: '/',
      filename: '[name].js'
    },
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loaders: ['react-hot', 'babel'],
          exclude: /node_modules/
        }
      ]
    }
  },

  dev: {
    entry: [
      'webpack-hot-middleware/client?http://localhost:5000',
      'webpack/hot/dev-server',
      path.join(PATHS.source, 'js/main.js')
    ],
    devtool: 'eval-source-map',
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    ]
  },

  prod: {
    entry: path.join(PATHS.source, 'js/main.js'),
    plugins: [
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ]
  }
};

export default PATHS;
export { webpackConfig };
