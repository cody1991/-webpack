也是才发现，入口文件不一定是 js 文件，也可以是 css 文件

```javascript
module.exports = {
  mode: 'development',
  entry: './src/index.css',
};
```

```css
body {
  width: 100%;
}
```

但是会报错的

```bash
yarn dev
yarn run v1.22.4
$ webpack
asset main.js 1.46 KiB [emitted] (name: main)
./src/index.css 23 bytes [built] [code generated] [1 error]

ERROR in ./src/index.css 1:5
Module parse failed: Unexpected token (1:5)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
> body {
|   width: 100%;
| }

webpack 5.35.1 compiled with 1 error in 80 ms
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```

这里我们开始去使用 loader，它的处理流程是

css -> css-loader -> webpack - bundle.js

我们先安装依赖

```bash
yarn add css-loader -D
```

修改配置文件，mode 使用 none 的原因是方便看打包后的文件代码

```javascript
module.exports = {
  mode: 'none',
  entry: './src/index.css',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: 'css-loader',
      },
    ],
  },
};
```

成功完成打包

```bash
yarn dev
yarn run v1.22.4
$ webpack
asset main.js 5.53 KiB [emitted] (name: main)
runtime modules 937 bytes 4 modules
cacheable modules 1.88 KiB
  ./src/index.css 323 bytes [built] [code generated]
  ./node_modules/css-loader/dist/runtime/api.js 1.57 KiB [built] [code generated]
webpack 5.35.1 compiled successfully in 377 ms
```

如果在页面引入的话发现样式没有生效

通过源码可以发现只是定义了这个模块，加载到 js 代码中，但是没有去使用

我们需要再加上 style-loader 把 css-loader 产生的代码使用上

css -> css-loader -> style-loader -> webpack - bundle.js

我们进行 `yarn add style-loader -D` 然后修改配置文件

这里需要注意的是， loader 配置里面的 use，loader 的顺序是倒序的

```javascript
module.exports = {
  mode: 'none',
  entry: './src/index.css',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
```

重新打包看看。此时发现我们的样式已经生效了

通过源码可以发现 style-loader 会把 css-loader 生成的代码，通过 创建 style 标签，添加到页面上

一般我们还是通过 js 文件作为入口文件，稍微调整下代码和配置文件

```javascript
// webpack.config.js
module.exports = {
  mode: 'none',
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};

// index.js

import './index.css';
```

这里想想为什么 要把 css 也打包进入 js 代码，不是应该分离吗？

其实想想如果有一个功能开发，我们在 html 代码里面引入 css 文件，然后开发 js 功能

但是后期可能不需要这个 js 模块功能了，我们移除 js 代码模块的同时还要去 html 代码中移除对应的 css 文件，同时维护两条线的成本是很高的

按照 webpack 的做法，所有资源都是 js 来控制，只需要维护我们的 js 代码就好了

## 开发一个 loader

any source -> loader1 -> loader2 -> loader3 -> javascript code

最后返回 js 代码

我们来开发一个简单的 markdown-loader

配置文件如下：

```javascript
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
        use: ['./markdown-loader'],
      },
    ],
  },
};
```

看一下我们的 loader 文件，是不是很简单？

```javascript
const marked = require('marked');
module.exports = (source) => {
  console.log(source);

  const html = marked(source);
  const code = `export default ${JSON.stringify(html)}`;
  return code;
};
```

loader 我们最终需要产生一段可执行的 js 代码，如上图

不过我们也可以进行一下变形，我们最终返回的是一段 html 字符串，然后交给下一个 loader 去处理

我们把我们的 loader 改成下面这样

```javascript
const marked = require('marked');
module.exports = (source) => {
  console.log(source);

  const html = marked(source);
  // const code = `export default ${JSON.stringify(html)}`;
  // return code;

  return html;
};
```

增加 html-loader：`yarn add html-loader -D`

调整一下配置文件

```javascript
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
```

发现也是正常打包运行的

# 总结

loader 机制是 webpack 核心机制

也因为 loader 的机制，整个社区可以添加新的 loader，加载任何资源

万物皆模块～
