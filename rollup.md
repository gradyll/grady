---
url: /rollup.md
---
# Rollup

## Overview(什么是Rollup)

`Rollup` 是 `JavaScript` 的模块捆绑器，它将小段代码编译成更大更复杂的代码，比如库或应用程序。

## Install(安装)

`npm install --global rollup`

## Quick Start (快速开始)

`Rollup`既可以通过带有可选配置文件的命令行接口使用，也可以通过其JavaScript API使用。

这些命令假设应用程序的入口点名为main.js，并且您希望将所有导入编译到一个名为bundle.js的文件中。

编译为浏览器：`For browsers:`

```
# compile to a <script> containing a self-executing function ('iife')
rollup main.js --file bundle.js --format iife
```

编译为node环境：`For Node.js:`

```
# compile to a CommonJS module ('cjs')
rollup main.js --file bundle.js --format cjs
```

编译为浏览器和node环境：`For both browsers and Node.js:`

```
# UMD format requires a bundle name
rollup main.js --file bundle.js --format umd --name "myBundle"
```

## Tree-shaking

除了支持ES模块的使用外，Rollup还静态地分析您正在导入的代码，并将排除实际上没有使用的任何代码。这允许您在现有工具和模块的基础上进行构建，而无需增加额外的依赖项或增加项目的规模。
