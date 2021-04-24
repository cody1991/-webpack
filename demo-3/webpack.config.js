const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const RemoveCommentsPlugin = require('./remove-comments-plugins');

const path = require('path');
module.exports = {
  mode: 'development',
  output: {
    filename: 'main.js',
    path: path.join(__dirname, 'dist'),
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'webpack plugin sample',
      template: './src/index.html',
    }),
    new HtmlWebpackPlugin({
      filename: 'about.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        // 需要拷贝的路径
        {
          from: 'public',
          to: 'public',
        },
      ],
    }),
    new RemoveCommentsPlugin(),
  ],
};
