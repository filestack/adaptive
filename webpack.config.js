const webpack = require('webpack');
const path = require('path');
const merge = require('lodash.merge');
const EsmWebpackPlugin = require('@purtuga/esm-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const manifest = require('./package.json');

const config =  {
  mode: 'production',
  node: { Buffer: false },
  performance: {
    maxAssetSize: 300000
  },
  watchOptions: {
    ignored: /node_modules/
  },
  entry: './build/module/index.js',
  output: {
    libraryTarget: 'umd',
    library: 'filestack',
    path: path.resolve(__dirname, 'build/browser'),
    filename: 'filestack.umd.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /^.*\.node\.js|.*\.node\.spec\.js|.*\.browser\.spec\.js|.*\.spec\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: '> 0.25%, not dead, ie 11',
                },
              ],
            ],
          },
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.BannerPlugin({ banner: `/* version ${manifest.version} */` }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': 'production',
      '@{VERSION}' : `${require('./package.json').version}`,
    }),
    new webpack.NormalModuleReplacementPlugin(/^.*\.node\.js$/,  (result) => {
      if (result.resource) {
        result.resource = result.resource.replace(/node/g, 'browser');
      }
    }),
  ],
  devtool: 'source-map',
};

const umd = merge({}, config, {
  output: {
    libraryTarget: 'umd',
    filename: 'adaptive.js',
  },
});

const esm = merge({}, config, {
  output: {
    libraryTarget: 'var',
    filename: 'adaptive.esm.js',
  },
  plugins: [
    new EsmWebpackPlugin(),
  ]
});

const prod = merge({}, config,  {
  output: {
    libraryTarget: 'umd',
    filename: 'adaptive.min.js',
  },
  plugins: [
    new WebpackAssetsManifest({
      writeToDisk: true,
      integrity: true,
    }),
  ],
});

module.exports = { umd, esm, prod };
