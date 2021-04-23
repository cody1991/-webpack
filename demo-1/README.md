我们编写一下以下的案例：

```html
<script src="src/index.js" type="module"></script>
```

```javascript
// src/index.js

import addHeader from './add-header.js';
const header = addHeader();
document.body.appendChild(header);
```

```javascript
// src/add-header.js
export default function addHeader() {
  const header = document.createElement('div');
  header.innerHTML = 'header';
  header.addEventListener('click', () => console.log('header'));
  return header;
}
```

采用 es module 的方式来编写。现在越来越多的浏览器也支持 es module，而新出的 vite 也是觉得现在大环境下 es module 的主流浏览器已经都支持了，可以大规模使用了

但是还不支持的话，我们上面这段代码是会报错的，我们开始引入 webpack 的学习

```bash
yarn add webpack webpack-cli -D
```

引入核心模块 webpack 和 命令行模块 webpack-cli

package.json 引入下面的命令

```json
"scripts": {
  "dev": "webpack"
},
```

什么都不做的情况下直接运行 `yarn dev` 能得到下面的结果

```bash
yarn dev
yarn run v1.22.4
$ webpack
asset main.js 198 bytes [emitted] [minimized] (name: main)
orphan modules 201 bytes [orphan] 1 module
./src/index.js + 1 modules 305 bytes [built] [code generated]

WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value.
Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/configuration/mode/

webpack 5.35.0 compiled with 1 warning in 247 ms
```

虽然有一些报错，但是最终得到了我们想要的文件 `dist/main.js`

修改下 index.html 文件

```html
<script src="dist/main.js"></script>
```

发现也是正常运行的，看下我们 main.js 的内容

```javascript
(() => {
  'use strict';
  const e = (function () {
    const e = document.createElement('div');
    return (
      (e.innerHTML = 'header'),
      e.addEventListener('click', () => console.log('header')),
      e
    );
  })();
  document.body.appendChild(e);
})();
```

不过显然使用的只是 webpack 默认的配置，项目中肯定需要很多定制化的配置，wepback 提供了 webpack.config.js 的默认配置文件，我们可以新建这么一个文件，去编写一些个性化配置

它返回的是一个模块化的配置对象，先配置一个简单的

```javascript
const path = require('path');
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
  },
};
```

我们重新打包，这个时候输出的文件名是 bundle.js 了，所以 html 文件也做对应的改变就好了

我们接下来也把 mode 给加上

```javascript
const path = require('path');
module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
  },
};
```

得到下面的打包结果和打包文件

```bash
npx webpack
asset bundle.js 4.33 KiB [emitted] (name: main)
runtime modules 670 bytes 3 modules
cacheable modules 305 bytes
  ./src/index.js 104 bytes [built] [code generated]
  ./src/add-header.js 201 bytes [built] [code generated]
webpack 5.35.0 compiled successfully in 111 ms
```

```javascript
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => {
  // webpackBootstrap
  /******/ 'use strict';
  /******/ var __webpack_modules__ = {
    /***/ './src/add-header.js':
      /*!***************************!*\
  !*** ./src/add-header.js ***!
  \***************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        eval(
          "__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ addHeader)\n/* harmony export */ });\nfunction addHeader() {\n  const header = document.createElement('div');\n  header.innerHTML = 'header';\n  header.addEventListener('click', () => console.log('header'));\n  return header;\n}\n\n\n//# sourceURL=webpack://demo-1/./src/add-header.js?"
        );

        /***/
      },

    /***/ './src/index.js':
      /*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        eval(
          '__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _add_header_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./add-header.js */ "./src/add-header.js");\n\nconst header = (0,_add_header_js__WEBPACK_IMPORTED_MODULE_0__.default)();\ndocument.body.appendChild(header);\n\n\n//# sourceURL=webpack://demo-1/./src/index.js?'
        );

        /***/
      },

    /******/
  }; // The module cache
  /************************************************************************/
  /******/ /******/ var __webpack_module_cache__ = {}; // The require function
  /******/
  /******/ /******/ function __webpack_require__(moduleId) {
    /******/ // Check if module is in cache
    /******/ var cachedModule = __webpack_module_cache__[moduleId];
    /******/ if (cachedModule !== undefined) {
      /******/ return cachedModule.exports;
      /******/
    } // Create a new module (and put it into the cache)
    /******/ /******/ var module = (__webpack_module_cache__[moduleId] = {
      /******/ // no module.id needed
      /******/ // no module.loaded needed
      /******/ exports: {},
      /******/
    }); // Execute the module function
    /******/
    /******/ /******/ __webpack_modules__[moduleId](
      module,
      module.exports,
      __webpack_require__
    ); // Return the exports of the module
    /******/
    /******/ /******/ return module.exports;
    /******/
  } /* webpack/runtime/define property getters */
  /******/
  /************************************************************************/
  /******/ /******/ (() => {
    /******/ // define getter functions for harmony exports
    /******/ __webpack_require__.d = (exports, definition) => {
      /******/ for (var key in definition) {
        /******/ if (
          __webpack_require__.o(definition, key) &&
          !__webpack_require__.o(exports, key)
        ) {
          /******/ Object.defineProperty(exports, key, {
            enumerable: true,
            get: definition[key],
          });
          /******/
        }
        /******/
      }
      /******/
    };
    /******/
  })(); /* webpack/runtime/hasOwnProperty shorthand */
  /******/
  /******/ /******/ (() => {
    /******/ __webpack_require__.o = (obj, prop) =>
      Object.prototype.hasOwnProperty.call(obj, prop);
    /******/
  })(); /* webpack/runtime/make namespace object */
  /******/
  /******/ /******/ (() => {
    /******/ // define __esModule on exports
    /******/ __webpack_require__.r = (exports) => {
      /******/ if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
        /******/ Object.defineProperty(exports, Symbol.toStringTag, {
          value: 'Module',
        });
        /******/
      }
      /******/ Object.defineProperty(exports, '__esModule', { value: true });
      /******/
    };
    /******/
  })(); // startup // Load entry module and return exports // This entry module can't be inlined because the eval devtool is used.
  /******/
  /************************************************************************/
  /******/
  /******/ /******/ /******/ /******/ var __webpack_exports__ = __webpack_require__(
    './src/index.js'
  );
  /******/
  /******/
})();
```

我们尝试下把注释全部去掉，看看运行

```javascript
(() => {
  ('use strict');
  var __webpack_modules__ = [
    ,
    (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.r(__webpack_exports__);
      __webpack_require__.d(__webpack_exports__, {
        default: () => addHeader,
      });
      function addHeader() {
        const header = document.createElement('div');
        header.innerHTML = 'header';
        header.addEventListener('click', () => console.log('header'));
        return header;
      }
    },
  ];

  var __webpack_module_cache__ = {};

  function __webpack_require__(moduleId) {
    var cachedModule = __webpack_module_cache__[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    var module = (__webpack_module_cache__[moduleId] = {
      exports: {},
    });

    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);

    return module.exports;
  }

  (() => {
    __webpack_require__.d = (exports, definition) => {
      for (var key in definition) {
        if (
          __webpack_require__.o(definition, key) &&
          !__webpack_require__.o(exports, key)
        ) {
          Object.defineProperty(exports, key, {
            enumerable: true,
            get: definition[key],
          });
        }
      }
    };
  })();

  (() => {
    __webpack_require__.o = (obj, prop) =>
      Object.prototype.hasOwnProperty.call(obj, prop);
  })();

  (() => {
    __webpack_require__.r = (exports) => {
      if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
        Object.defineProperty(exports, Symbol.toStringTag, {
          value: 'Module',
        });
      }
      Object.defineProperty(exports, '__esModule', { value: true });
    };
  })();

  var __webpack_exports__ = {};
  (() => {
    __webpack_require__.r(__webpack_exports__);
    var _add_header_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

    const header = (0, _add_header_js__WEBPACK_IMPORTED_MODULE_0__.default)();
    document.body.appendChild(header);
  })();
})();
```

根据浏览器的断点运行看看执行结果，对 webpack 的机制就大概懂了

尝试多引入一个模块，发现大体框架都不变的

```javascript
/******/ (() => {
  // webpackBootstrap
  /******/ 'use strict';
  /******/ var __webpack_modules__ = [
    ,
    /* 0 */ /* 1 */
    /***/ (
      __unused_webpack_module,
      __webpack_exports__,
      __webpack_require__
    ) => {
      __webpack_require__.r(__webpack_exports__);
      /* harmony export */ __webpack_require__.d(__webpack_exports__, {
        /* harmony export */ default: () => /* binding */ addHeader,
        /* harmony export */
      });
      function addHeader() {
        const header = document.createElement('div');
        header.innerHTML = 'header';
        header.addEventListener('click', () => console.log('header'));
        return header;
      }

      /***/
    },
    /* 2 */
    /***/ (
      __unused_webpack_module,
      __webpack_exports__,
      __webpack_require__
    ) => {
      __webpack_require__.r(__webpack_exports__);
      /* harmony export */ __webpack_require__.d(__webpack_exports__, {
        /* harmony export */ default: () => /* binding */ add,
        /* harmony export */
      });
      function add(a, b) {
        return a + b;
      }

      /***/
    },
    /******/
  ]; // The module cache
  /************************************************************************/
  /******/ /******/ var __webpack_module_cache__ = {}; // The require function
  /******/
  /******/ /******/ function __webpack_require__(moduleId) {
    /******/ // Check if module is in cache
    /******/ var cachedModule = __webpack_module_cache__[moduleId];
    /******/ if (cachedModule !== undefined) {
      /******/ return cachedModule.exports;
      /******/
    } // Create a new module (and put it into the cache)
    /******/ /******/ var module = (__webpack_module_cache__[moduleId] = {
      /******/ // no module.id needed
      /******/ // no module.loaded needed
      /******/ exports: {},
      /******/
    }); // Execute the module function
    /******/
    /******/ /******/ __webpack_modules__[moduleId](
      module,
      module.exports,
      __webpack_require__
    ); // Return the exports of the module
    /******/
    /******/ /******/ return module.exports;
    /******/
  } /* webpack/runtime/define property getters */
  /******/
  /************************************************************************/
  /******/ /******/ (() => {
    /******/ // define getter functions for harmony exports
    /******/ __webpack_require__.d = (exports, definition) => {
      /******/ for (var key in definition) {
        /******/ if (
          __webpack_require__.o(definition, key) &&
          !__webpack_require__.o(exports, key)
        ) {
          /******/ Object.defineProperty(exports, key, {
            enumerable: true,
            get: definition[key],
          });
          /******/
        }
        /******/
      }
      /******/
    };
    /******/
  })(); /* webpack/runtime/hasOwnProperty shorthand */
  /******/
  /******/ /******/ (() => {
    /******/ __webpack_require__.o = (obj, prop) =>
      Object.prototype.hasOwnProperty.call(obj, prop);
    /******/
  })(); /* webpack/runtime/make namespace object */
  /******/
  /******/ /******/ (() => {
    /******/ // define __esModule on exports
    /******/ __webpack_require__.r = (exports) => {
      /******/ if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
        /******/ Object.defineProperty(exports, Symbol.toStringTag, {
          value: 'Module',
        });
        /******/
      }
      /******/ Object.defineProperty(exports, '__esModule', { value: true });
      /******/
    };
    /******/
  })();
  /******/
  /************************************************************************/
  var __webpack_exports__ = {};
  // This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
  (() => {
    __webpack_require__.r(__webpack_exports__);
    /* harmony import */ var _add_header_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      1
    );
    /* harmony import */ var _add_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      2
    );

    console.log((0, _add_js__WEBPACK_IMPORTED_MODULE_1__.default)(1, 2));
    const header = (0, _add_header_js__WEBPACK_IMPORTED_MODULE_0__.default)();
    document.body.appendChild(header);
  })();

  /******/
})();
```
