/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

const nodeExternals = require('webpack-node-externals');
const RemovePlugin = require('remove-files-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const distFolder = path.resolve(__dirname, 'dist');

module.exports = {
  devtool: 'source-map',

  entry: makeEntries(),

  experiments: {
    outputModule: true
  },

  externals: [nodeExternals()],

  mode: 'production',

  module: {
    rules: [
      {
        test: /\.[tj]s$/,
        use: ['ts-loader']
      }
    ]
  },

  output: {
    filename: '[name].js',
    clean: true,
    path: distFolder,
    library: {
      type: 'module'
    }
  },

  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        path.resolve(__dirname, 'package.json'),
        path.resolve(__dirname, '..', 'README.md'),
        path.resolve(__dirname, '..', 'LICENSE'),
        {
          from: path.resolve(__dirname, '..', 'docs'),
          to: 'docs',
          noErrorOnMissing: true
        },
        copyAll('build/**/*.js'),
        copyAll('build/**/*.js.map'),
        copyAll('build/**/*.d.ts')
      ]
    }),
    new RemovePlugin({
      after: {
        test: [
          {
            folder: 'dist',
            method: absoluteItemPath => {
              if (absoluteItemPath.includes('node_modules')) {
                return false;
              }
              const filesMatchingPatternToDelete = [/test.*\.[tj]s(\.map)?$/];
              return filesMatchingPatternToDelete.some(pattern => pattern.test(absoluteItemPath));
            },
            recursive: true
          },
          {
            folder: __dirname,
            method: absoluteItemPath => {
              if (absoluteItemPath.includes('node_modules')) {
                return false;
              }
              return (
                absoluteItemPath.includes(`${path.sep}build${path.sep}`) ||
                absoluteItemPath.endsWith(`${path.sep}build`)
              );
            },
            recursive: true
          }
        ]
      }
    })
  ],

  resolve: {
    alias: {},
    extensions: ['.ts', '.js'],
    symlinks: false
  },

  stats: 'errors-warnings'
};

function makeEntries() {
  const entries = {};

  return entries;
}

/**
 *
 * @param {string} globPattern
 * @returns {import('copy-webpack-plugin').Pattern}
 */
function copyAll(globPattern) {
  return {
    from: globPattern,
    to({ absoluteFilename }) {
      return path.resolve(distFolder, absoluteFilename.split('build')[1].substring(1));
    }
  };
}
