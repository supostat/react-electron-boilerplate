import webpack from 'webpack';
import path from 'path';
import merge from 'webpack-merge';
import baseConfig from './webpack.config.base';
import { dependencies } from '../package.json';
import CheckNodeEnv from '../internals/scripts/check-node-env';

CheckNodeEnv('development');

const dist = path.resolve(process.cwd(), 'dll');

export default merge.smart(baseConfig, {
  mode: 'development',
  context: process.cwd(),
  devtool: 'source-map',
  target: 'electron-renderer',
  externals: ['fsevents', 'crypto-browserify'],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
    ],
  },
  entry: {
    renderer: Object.keys(dependencies || {}).filter(dependency => dependency !== 'font-awesome'),
  },
  output: {
    library: 'renderer',
    path: dist,
    filename: '[name].dev.dll.js',
    libraryTarget: 'var',
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(dist, '[name].json'),
      name: '[name]',
    }),
    new webpack.LoaderOptionsPlugin({
      debug: true,
      options: {
        context: path.resolve(process.cwd(), 'app'),
        output: {
          path: path.resolve(process.cwd(), 'dll'),
        },
      },
    }),
  ],
});
