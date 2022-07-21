
# Commitizen规范化提交代码

## 安装 `husky` 依赖

```
# 在项目的根路径下（即.git的所在目录）
npm install --save-dev husky
```

## 安装 `commitlint`

```
# 在 node_modules的同级下安装
npm install --save-dev @commitlint/config-conventional @commitlint/cli @commitlint/prompt-cli
```
## 项目中安装 `husky`
```sh
# 在项目的根目录（即.git的所在目录）
npx husky install

```
## 生成 `commitlint` 配置文件

```sh
echo "module.exports = {extends: ['@commitlint/config-conventional']};" > commitlint.config.js
```

## 在 `packag.json` 中添加

```json
# 第一层级
husky": {
  "hooks": {
    "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
  }
}
```

## Add Hook
```
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit $1'
```

:::warning
以上安装完成之后还需要安装一个库
:::

1. 全局安装 `Commitizen`
```
npm install -g commitizen
```
2. 安装并配置 `cz-customizable` 插件

```
npm i cz-customizable
```
3. 添加以下配置到 `package.json` 中
```json
 "config": {
    "commitizen": {
      "path": "node_modules/cz-customizable"
    }
  }
```
4. 项目根目录下创建 `.cz-config.js` 自定义提示文件
```js
module.exports = {
  // 可选类型
  types: [
    { value: 'feat', name: 'feat:     新功能' },
    { value: 'fix', name: 'fix:      修复' },
    { value: 'docs', name: 'docs:     文档变更' },
    { value: 'style', name: 'style:    代码格式(不影响代码运行的变动)' },
    {
      value: 'refactor',
      name: 'refactor: 重构(既不是增加feature，也不是修复bug)'
    },
    { value: 'perf', name: 'perf:     性能优化' },
    { value: 'test', name: 'test:     增加测试' },
    { value: 'chore', name: 'chore:    构建过程或辅助工具的变动' },
    { value: 'revert', name: 'revert:   回退' },
    { value: 'build', name: 'build:    打包' }
  ],
  // 消息步骤
  messages: {
    type: '请选择提交类型:',
    customScope: '请输入修改范围(可选):',
    subject: '请简要描述提交(必填):',
    body: '请输入详细描述(可选):',
    footer: '请输入要关闭的issue(可选):',
    confirmCommit: '确认使用以上信息提交？(y/n/e/h)'
  },
  // 跳过问题
  skipQuestions: ['body', 'footer'],
  // subject文字长度默认是72
  subjectLimit: 72
}
```
5. 使用 `git cz` 代替 `git commit`,即可看到提示内容
![git cz提示](/grady/cz_alt.jpg)