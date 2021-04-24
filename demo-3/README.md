插件机制，主要是增加 webpack 在项目自动化构建方面的能力

loader 是各种资源加载的问题

plugins 是除了打包资源之外其他的构建能力

比如：

- 自动清除 dist 文件
- 自动生成 html 文件
- 根据环境为代码注入类似 api 这种地址可能变化的部门
- 拷贝不需要参与打包的资源文件到指定输出目录
- 压缩打包后的输出文件
- 自动发布打包结果到服务器实现自动部署

# 插件使用

## 目录清除

`yarn add clean-webpack-plugin -D`

修改配置文件

```javascript
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
module.exports = {
  mode: 'development',
  output: {
    filename: 'main.js',
    path: path.join(__dirname, 'dist'),
  },
  plugins: [new CleanWebpackPlugin()],
};
```

我们可以调整下输出文件的名字，然后重新打包，可以发现上次产生的文件已经被清除了

## 自动生成 html 文件

`yarn add html-webpack-plugin -D`

可以看看基本的一些配置：

```javascript
// webpack.config.js
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
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
  ],
};
```

```html
<!-- src/index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><%= htmlWebpackPlugin.options.title %></title>
  </head>
  <body>
    <div class="container">
      <h1>结构</h1>
      <div id="root"></div>
    </div>
  </body>
</html>
```

打包完之后的代码如下所示：

```html
<!-- dist/index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>webpack plugin sample</title>
    <script defer src="main.js"></script>
  </head>
  <body>
    <div class="container">
      <h1>结构</h1>
      <div id="root"></div>
    </div>
  </body>
</html>
```

如果向再生成更多的 html 文件，可以在 plugins 加入

```javascript
new HtmlWebpackPlugin({
  filename: 'about.html',
});
```

不过这里暂时只是用了一个入口，所以 about.html 和 index.html 引用同一个 main.js 文件。我们可以使用多入口来处理

## 文件复制

不需要参与构建的静态文件，比如 favicon robots.txt

可以放在根目录的 public / static 下

我们希望 webpack 打包的时候把这个目录下的文件都复制到输出目录，可以使用 copy-webpack-plugin

`yarn add copy-webpack-plugin -D`

简单的修改下配置

```javascript
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
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
  ],
};
```

# 实现一个插件

每一个环节，都预留了一个钩子，我们可以在钩子上进行一些操作或者任务

合适的时机去做合适的事情，类似事件绑定

接下来我们开发移除注释的插件

webpack 要求插件返回的是一个函数，或者包含 apply 方法的类

```javascript
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
```

```javascript
class RemoveCommentsPlugin {
  apply(compiler) {
    // compiler 包含了此次构建的所有配置信息
    console.log('remove comments plugin');

    // emit钩子 会在即将生成文件到输出目录之前执行

    // tap 方法注册钩子函数，第一个参数是插件名称，第二个是挂载到这个钩子上的函数

    compiler.hooks.emit.tap('RemoveCommentsPlugin', (compilation) => {
      // compilation 此次打包上下文
      // compilation.assets 资源文件信息
      for (const name in compilation.assets) {
        console.log(name);

        // 文件内容
        // console.log(compilation.assets[name].source());

        if (name.endsWith('.js')) {
          const contents = compilation.assets[name].source();
          const noComments = contents.replace(/\/\*{2,}\/\s?/g, '');
          compilation.assets[name] = {
            source: () => noComments,
            size: () => noComments.length,
          };
        }
      }
    });
  }
}

module.exports = RemoveCommentsPlugin;
```
