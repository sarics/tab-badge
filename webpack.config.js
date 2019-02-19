const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  context: path.resolve(__dirname, 'src'),

  mode: process.env.NODE_ENV,

  entry: {
    background: './background/background.js',
    content: './content/content.js',
    options: './options/options.js',
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]/[name].js',
  },

  devtool: false,

  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new CopyWebpackPlugin([
      {
        from: 'manifest.json',
      },
      // {
      //   from: 'icons',
      //   to: 'icons',
      // },
      {
        from: 'options/*.+(html|css)',
      },
    ]),
  ],

  stats: isProd ? 'normal' : 'errors-only',
};
