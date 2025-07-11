---
url: /grady/workLog.md
---
# 如何发布之后自动更新

## 描述

在发布之后，我们会经常遇到一些更新问题，比如：

* 代码逻辑还是之前的
* 点击按钮跳转后路由报错
* 更新时无法通知到用户

## 环境

* 企业微信h5
* vite + vue3 + ts

## 配置

在 vite.config.ts 打包配置中添加相关插件代码

```ts
// 发布之后自动更新
import { writeFileSync } from 'fs';
import { resolve } from 'path';
{

  plugins: [
  {
        name: 'vite-build-version',
        apply: 'build',
        buildStart() {
          console.log('buildEnd')
          const version = process.env.npm_package_version;
          const timestamp = new Date().toISOString();
          // 生成 version.json 文件
          const versionInfo = {
            version,
            buildTime: timestamp,
          };

          const outputPath = resolve(__dirname, './public', 'version.json');
          writeFileSync(outputPath, JSON.stringify(versionInfo, null, 2));
        }
      },
  ]
}

```

在 public 目录下创建 version.json 文件

```json
{
  "version": "1.0.0",
  "buildTime": "2023-04-20T10:30:00.000Z"
}
```

最后在入口文件中添加以下代码

```ts
let url = isDev ? "/version.json" : "/dmsapp/repair/version.json";
fetch(url)
  .then((res) => res.json())
  .then((res) => {
    if (!localStorage.getItem("version")) {
      localStorage.setItem("version", res.version);
    } else {
      if (localStorage.getItem("version") != res.version) {
        localStorage.setItem("version", res.version);
        location.reload();
      }
    }
  });

```
