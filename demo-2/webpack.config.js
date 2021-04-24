module.exports = {
  mode: 'none',
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.md$/,
        // 不一定是模块名，也可以是路径
        use: ['html-loader', './markdown-loader'],
      },
    ],
  },
};
