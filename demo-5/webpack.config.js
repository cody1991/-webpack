const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: 'development',
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
  devServer: {
    // 额外的静态资源路径，开发环境先不需要使用 copy-webpack-plugin
    contentBase: 'public',
    proxy: {
      // http://localhost:8080/api/users => https://api.github.com/users
      '/api': {
        target: 'https://api.github.com',
        pathRewrite: {
          '^/api': '', // 替换掉代理地址中的 /api
        },
        changeOrigin: true, // 确保请求 GitHub 的主机名是 api.github.com
      },
    },
  },
};
