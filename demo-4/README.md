# 运行机制和工作原理

各种资源文件，在 webpack 中都是一个资源模块，通过 webpack 打包最终聚集在了一起

整个打包过程中

- 通过 loader 处理特殊资源都加载，比如加载样式，图片
- 通过 plugin 实现各种自动化的构建任务，比如自动压缩，自动发布

工作过程如下：

- 根据配置找到某一个文件作为入口，一般是 js 文件
- 然后根据这个文件中的 import 或者 require 解析推断依赖的资源文件
- 然后继续解析各个资源文件的依赖模块，不断递归下去，最终得到一个依赖关系树
- 根据配置文件的 loader ，去加载模块
- 把加载后的结果放入到 bundle.js 中，实现整个项目的打包

一些图片和字体文件，无法用 js 来表示的，loader 会把它们单独作为资源文件拷贝到输出目录，然后把每个资源文件对应的路径作为模块的导出成员暴露给外部使用

插件机制不会影响核心打包过程。在每个环节预设了钩子，在这些钩子上可以加入我们的自定义的任务，完成我们想要做的事情

## 查阅 webpack 源代码

1. webpack cli 启动打包流程
2. 载入 webpack 模块，创建 complier 对象
3. 使用 complier 对象开始编译整个项目
4. 从入口文件开始，解析模块依赖，形成依赖树
5. 递归依赖树，每个模块交给对应的 loader 处理
6. 合并 loader 的处理完的结果，把打包结果输出到 dist 目录

### webpack cli

webpack 可以通过其他方式使用，并不一定依赖于 webpack cli，所以它们也分离出来了两个爆

webpack cli 的作用是把 cli 的参数和 webpack 配置文件中的配置进行整合，得到一个完整的配置对象

然后载入 webpack 核心模块，传入配置对象，创建了 compiler 对象

options 还可以是一个数组，支持多路打包，不过我们一般是一个对象，单线打包

### compiler 对象

创建好 compiler 对象，开始注册了插件，因为从这里开始 webpack 的生命周期了，我们需要尽早的加载插件

这里也会判断监视模式，会去调用 webpack 的 watch 监视方法，如果没有的话，就开始调用 run 方法

这里会触发 beforeRun 和 run 的钩子函数

然后调用 compile 方法，真正的构建我们的项目

### 开始构建

创建一个 newCompliation 对象，理解成构建过程中的上下文对象，包含了所以的资源信息和额外的信息，触发 make 钩子

### make 阶段

根据 entry 入口模块，递归出所有的依赖，形成依赖树，递归每个模块交给不同的 loader 处理

具体流程是：

- SingleEntryPlugin 调用了 Compilation 对象 addEntry，解析入口
- addEntry 方法中调用 `_addModuleChain` 方法，把入口模块添加到模块依赖列表
- Compilation 对象的 buildModule 方法进行模块构建
- buildModule 方法中执行具体的 loader，处理特殊资源的加载
- build 完成，使用 acorn 库生成对应代码的 ast 语法树
- 根据语法树分析这个模块是否还有依赖的模块，如果有，循环 build 每个依赖
- 所以依赖解析完成， build 阶段结束
- 合并生成需要输出的 bundle.js 写到 dist 目录
