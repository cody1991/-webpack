# Dev Server 提高本地开发效率

我们虽然可以使用 `webpack --watch` 加上 `browsersync` 工具，实现

- webpack 监听源代码，自动构建
- browsersync 监听 dist 代码，自动刷新浏览器

但是多工具的使用，以及频繁磁盘读写，效率还是低下的

我们可以直接使用官方的 webpack-dev-server 工具

`yarn add webpack-dev-server -D`

执行 `yarn dev`

注意，webpack5 从以前的 `webpack-dev-server` 命令变成了 `webpack serve` 命令

https://stackoverflow.com/questions/40379139/cannot-find-module-webpack-bin-config-yargs

```json
  "scripts": {
    "dev": "webpack serve"
  },
```

我们就可以开启本地调试了

另外 webpack-dev-server 是会把构建的文件写到内存中，所以速度会快很多

可以先简单看一下我们的配置，主要注意里面的注释

```javascript
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
```
