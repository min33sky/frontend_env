const webpack = require('webpack');
const path = require('path');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  // mode: isDevelopment ? 'development' : 'production',
  mode: 'development',
  devtool: 'eval',
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  entry: {
    app: './src/index.jsx',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                targets: { browsers: ['last 2 chrome versions'] },
                debug: true,
              },
            ],
            '@babel/preset-react',
          ],
          plugins: ['react-refresh/babel'],
        },
      },
    ],
  },
  plugins: [new ReactRefreshWebpackPlugin(), new webpack.HotModuleReplacementPlugin()],

  output: {
    path: path.join(__dirname, '/dist'),
    filename: '[name].js',
    publicPath: '/dist',
  },

  devServer: {
    publicPath: '/dist',
    hot: true,
  },
};
