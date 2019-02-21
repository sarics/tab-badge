const path = require('path');
const cssnano = require('cssnano');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  context: path.resolve(__dirname, 'src'),

  mode: isProd ? 'production' : 'development',

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
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              importLoaders: isProd ? 2 : 1,
            },
          },
          isProd && {
            loader: 'postcss-loader',
            options: {
              plugins: [
                cssnano({
                  preset: 'default',
                }),
              ],
            },
          },
          { loader: 'sass-loader' },
        ].filter(Boolean),
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
        from: 'options/options.html',
        to: 'options',
      },
    ]),
  ],

  stats: isProd ? 'normal' : 'errors-only',
};
