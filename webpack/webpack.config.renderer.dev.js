import path from 'path';
import fs from 'fs';
import webpack from 'webpack';
import chalk from 'chalk';
import merge from 'webpack-merge';
import { spawn, execSync } from 'child_process';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import baseConfig from './webpack.config.base';
import CheckNodeEnv from '../internals/scripts/check-node-env';

CheckNodeEnv('development');

const port = process.env.PORT || 1212;
const publicPath = `http://localhost:${port}/dist`;
const dll = path.resolve(process.cwd(), 'dll');
const manifest = path.resolve(dll, 'renderer.json');

if (!(fs.existsSync(dll) && fs.existsSync(manifest))) {
  console.log(
    chalk.black.bgYellow.bold(
      'The DLL files are missing. Sit back while we build them for you with "npm run build-dll"'
    )
  );
  execSync('npm run build-dll');
}

export default merge.smart(baseConfig, {
  mode: 'development',
  devtool: 'source-map',
  target: 'electron-renderer',
  entry: [path.join(__dirname, '../src/app/index.js')],
  output: {
    publicPath: `http://localhost:${port}/dist/`,
    filename: 'renderer.dev.js',
  },
  plugins: [
    // new webpack.DllReferencePlugin({
    //   context: process.cwd(),
    //   manifest: require(manifest),
    // }),
    // new webpack.HotModuleReplacementPlugin({
    //   multiStep: true,
    // }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.LoaderOptionsPlugin({
      debug: true,
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
  node: {
    __dirname: false,
    __filename: false,
  },
  devServer: {
    port,
    publicPath,
    compress: true,
    noInfo: true,
    stats: 'errors-only',
    lazy: false,
    headers: { 'Access-Control-Allow-Origin': '*' },
    contentBase: path.join(__dirname, '../dist'),
    watchOptions: {
      aggregateTimeout: 300,
      ignored: /node_modules/,
      poll: 100,
    },
    historyApiFallback: {
      verbose: true,
      disableDotRule: false,
    },
    before() {
      if (process.env.START_HOT) {
        console.log('Starting Main Process...');
        spawn('npm', ['run', 'start-main-dev'], { shell: true, env: process.env, stdio: 'inherit' })
          .on('close', code => process.exit(code))
          .on('error', spawnError => console.error(spawnError));
      }
    },
  },
});
