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
