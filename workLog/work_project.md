---
url: /grady/workLog/work_project.md
---
# PC 项目困/难点总结

> 适用于面试准备，提炼技术难点与解决方案

***

## 一、项目概览

* **项目名称**：云 DMS（经销商管理系统）
* **技术栈**：Vue 2.x + Vuex + Vue Router + Element UI + Axios + Webpack 4
* **业务领域**：汽车经销商售后管理（维修、索赔、配件、结算、客户等）
* **规模**：2000+ 前端文件，多微服务后端对接

***

## 二、核心技术难点

### 1. 权限与认证体系

**难点描述**：

* **多级权限**：菜单级 + 页面级 + 按钮级（`authList` / `authMark`）权限控制
* **多种登录方式**：OAuth2 授权码模式、DOS Token、API 直连（`getTokenByApi`）
* **白名单管理**：`whiteList`（免登录）、`whiteAuth`（免权限）、`whiteSite`（内网免登录）
* **SSO 集成**：与 Dealer Portal 单点登录对接，需处理 `code` 换取 `token`、重定向等

**实现要点**：

* `router.beforeEach` 中统一鉴权，未登录则拉取 navList，无权限跳 404
* `formateMenu` 递归扁平化树形菜单，用于路径权限校验
* `MultiuseButton` 通过 `authList.includes(authMark)` 控制按钮显隐

***

### 2. API 签名与安全

**难点描述**：

* 所有请求需携带 **MD5 签名**（`signMd5Utils`）
* 签名规则：`md5(JSON.stringify(升序参数) + secret_key).toUpperCase()`
* `secret_key` 由 `sessionStorage.appIdKey` 经 DES 解密得到
* GET/POST/DELETE 参数处理方式不同（URL 参数、body、数组序列化）
* 需兼容 `|` 分隔的日期范围等特殊参数

**实现要点**：

* `fetchApi.post/get/put/delete` 统一封装，自动拼 `sign`、`timestamp`
* `urlToJson` 分离需签名参数与直接拼接的 `originStringQuery`
* `signMd5Utils.getSign` 支持数组参数 `arrayString` 序列化

***

### 3. 动态菜单与路由管理

**难点描述**：

* 菜单由后端接口按 `roleId` 返回，需与本地 `menu.js` 路由映射
* 多级菜单递归渲染（`menuTree.js` 中 `createMenuTree`）
* 图标、`hideInMenu` 等属性需从路由表 `deepFind` 补齐
* 支持外链菜单（`/^https?:\/\//.test(key)`）

**实现要点**：

* `deepMenu` 将接口数据转为前端菜单结构
* `formateNavList` 与 `routesMap` 匹配，补全 `icon`、`hideInMenu`
* JSX 渲染 `el-submenu` / `el-menu-item`，递归处理 `children`

***

### 4. KeepAlive 与多 Tab 缓存

**难点描述**：

* 头部 Tab 需缓存页面状态，但存在 `maxCacheNum: 10` 限制
* `keep-alive :include` 需动态维护 `cachedNames`（组件名列表）
* 关闭 Tab 时要 `removeKeepAliveNames`，否则内存泄漏
* **Iframe 页面**需单独管理 `iframeComponentsArr`，支持动态注册、`v-show` 切换

**实现要点**：

* `MultiTab` 监听 `$route`，对 `meta.keepAlive` 的页面调用 `addKeepAliveNames`
* `RouteView` 中 `cachedNames = ['RouteView', ...keepAliveNames.map(x => x.value)]`
* 超限时 `Notification.warning` 提示，并 `next(false)` 阻止跳转

***

### 5. 虚拟滚动组件（VirtualScroll）

**难点描述**：

* 自研虚拟滚动，支持 **固定行高**（`itemSize`）与 **动态行高**（`sizeField` / `minItemSize`）
* 支持垂直/水平方向、`pageMode`（基于文档滚动）
* 使用 `pool` 复用 DOM、`$_views` / `$_unusedViews` 管理视图实例
* `buffer` 预渲染区域、`scrollToItem` / `scrollToPosition` 等能力

**实现要点**：

* 通过 `sizes` 累加计算每项位置，`updateVisibleItems` 决定可见项
* `will-change: transform` + `translateY/X` 优化渲染
* `DynamicScroll` 支持 `getItemSize` 回调，适配高度不定的场景

***

### 6. 复杂表格组件（BaseTable）

**难点描述**：

* `pageTable.vue` 2000+ 行，集成筛选、排序、分页、导出、列过滤
* 支持服务端排序（`isServerSorter`）、服务端筛选（`isServerFilter`）
* 多数据源形态：`dataSource` 为数组或 `{ items, total }`
* 列配置复杂：`columnsRef`、`rowstyles`、`cellstyles`、`selectionType` 等
* 需与 `TopFilter`、`ColumnFilter`、`ExportExcel`、`Pagination` 等子组件联动

**实现要点**：

* `mergeProps`、`getOptionProps` 统一处理 props 透传
* `fetchapi` 统一封装请求，支持 `params`、`uidkey`、`datakey` 适配不同接口
* 支持 `defaultSelections` 预选、`selectionType: single|multiple`

***

### 7. 按需加载与懒加载 Tab

**难点描述**：

* `LazyLoadTab` 通过 `require([`@/pages/${path}`], resolve)` 动态加载 Tab 内容
* 需解决 `path` 与组件名的映射（`tabMenus` 中 `title` 对应路径）
* `destroyOnClose` 控制 Tab 切换时是否销毁子组件
* 非当前 Tab 不渲染（`lazy`），减少首屏开销

**实现要点**：

* `loadComponent` 在 `activeName` 变化时注册组件
* `createTabPanel` 中用 `h(this.$options.components[x.title], ...)` 渲染
* `keep-alive` 包裹或按需 `isCurrent ? component : null`

***

### 8. 构建与性能优化

**难点描述**：

* 项目体积大，需 `--max-old-space-size=8192` 避免 Node 内存溢出
* 多微服务导致依赖分散，需合理的 `splitChunks` 策略
* `element-ui` 单独拆包（`app-elementUI`）、公共组件拆包（`app-commons`）
* `maxSize: 9000000` 控制单 chunk 大小，`maxInitialRequests: 4` 控制初始请求数

**实现要点**：

* `splitChunks.cacheGroups` 区分 libs、elementUI、commons
* `chunkFilename` 使用 `[chunkhash:8]` 利于缓存
* 开发环境 `cheap-source-map`，生产可关闭 `productionSourceMap`

***

### 9. 第三方 Iframe 集成

**难点描述**：

* 多个第三方系统（订购、VMS、ETKA 等）通过 iframe 嵌入
* URL 需动态拼接：`token`、`userId`、`pagetype` 等，部分需 MD5 加密
* `postMessage` 与 iframe 内页面通信（如 `partEtkaInfo` 传 `sstCode`）
* 需与 `keep-alive`、Tab 关闭逻辑配合，避免 iframe 残留
* iframe 高度需根据布局动态计算（`footer - top`）

**实现要点**：

* `getUrl` 中 `queryOEMDefaultParaValueByCode` 获取基础 URL
* Token 格式：`userId#timestamp#DMS#md5(secret)` 等
* `RouteView` 中 `iframeComponentsArr`、`hasOpenComponentsArr` 控制 iframe 组件的注册与显示

***

### 10. 防重复提交与业务校验

**难点描述**：

* 按钮级防重复：`MultiuseButton` 通过 `ajaxing` 状态 + `sleep(200)` 防抖
* 业务层重复校验：如配件订购的 `checkRepeatPartList` 校验重复件
* 异常件限制：`preErrorPartList`、`showPartExistsOrderDialog` 等复杂分支
* 多步骤提交流程中的状态管理与回滚

**实现要点**：

* `clickHandler` 中 `ajaxing = true`，`await this.click()` 后 `ajaxing = false`
* `isDisabled = ajaxing || disabled` 控制按钮不可用
* 业务侧需区分「继续提交」「取消」等用户选择，并串联后续校验逻辑

***

### 11. WebSocket 实时通知

**难点描述**：

* 需与后端 WebSocket 服务建立长连接（`sockectNew.js`）
* 连接状态管理（`isOpen`）、重连、心跳等
* 与 Vuex 集成，消息需驱动全局通知（如 `createPromotionNotify`）
* 多 Tab 场景下消息处理的归属与去重

**实现要点**：

* `ConnectWebsocket` 封装连接逻辑，`getWSUrl` 从配置或 session 获取地址
* 消息到达后通过 Vuex action 更新状态，触发 UI 展示

***

### 12. 多环境与微服务代理

**难点描述**：

* 开发环境需配置大量 `proxyTable`（`/clouddms`、`/dms.part`、`/dms.claim` 等）
* 各服务独立部署，地址可能随环境变化
* 需区分 development / test / production，`config.serverUrl` 等动态切换

**实现要点**：

* `config/index.js` 中 `proxyTable` 按服务拆分
* `pathRewrite` 统一前缀，`changeOrigin` 解决跨域
* `.env`、`dotenv-webpack` 管理环境变量

***

### 13. 打印功能

**难点描述**：

* **多端适配**：PC 端 Lodop 控件、非插件浏览器 CLodop 云打印、移动端/平板 C-Lodop、纯浏览器 `window.print`
* **Lodop vs CLodop**：`needCLodop()` 根据 UA 判断（Chrome 41+、Firefox 41+、Edge、移动端等需 CLodop），旧版 IE 用 ActiveX 插件
* **模板动态加载**：`BasePrint` 按 `template` 从 `printTemplate/` 动态 `require` 打印模板组件
* **样式与分页**：Vue 的 `break-after: page` 需替换为 `page-break-after: always`；全局 style 注入
* **WebPrint（PDF）**：PDF 通过 iframe + PDF.js 预览打印；IE 用 `/static/webPrint/pdf/web/viewer.html?file=`
* **打印配置服务**：`configPrint` 接口管理打印机列表、类型，支持远程打印服务

**实现要点**：

* `getLodop()`：双端口 8000/18000 加载 CLodop，未安装时提示下载 `install_lodop32/64.exe`、`CLodop_Setup_for_Win32NT.exe`
* `BasePrint`：`printerType`(laser/针打)、`direction`(vertical/horizontal)、`alwaysPrint`(连续纸)、`printCopies`、`ifPrintPreview`(直接打印/预览)
* `createPrintLogo`：表头注入经销商 logo、名称
* `$print(dom)` 插件：将 DOM 克隆到 iframe，处理 input/textarea/select 状态，`execCommand('print')` 或 `window.print()`
* `clodopPad.js`：Pad 端走 HTTPS C-Lodop 服务（如 8443 端口）
* 独立打印页：`/print`、`/printPre`、`/appReceptionPrint`、`/balanceApp` 等在 `whiteList`，供移动 App 或外链直接打开

**打印模板体系**：

* 维修工单、预检单、结算单、索赔单、配件出入库单、工具借还单、领料单等 30+ 业务模板
* 模板统一放在 `printTemplate/`，通过 `data`、`fileAddress`、`updateDate` 等 props 传参

***

## 三、业务复杂度相关

| 模块         | 复杂度说明                                           |
|--------------|------------------------------------------------------|
| 维修接待     | 多 Tab、配件建议、工单打印、Lodop 打印集成           |
| 配件订购     | 购物车、重复件校验、异常件限制、ETKA iframe 集成     |
| 索赔管理     | 预索赔、三包、QA 等多子业务，流程分支多             |
| 结算         | 工单结算、索赔结算、败诉结算等，数据结构复杂         |
| 报表         | ECharts 图表、多维度筛选、Excel 导出                 |
| **打印**     | **BasePrint(Lodop) / WebPrint(PDF) / $print(DOM) / CLodop 云打印 / Pad 端 C-Lodop；30+ 业务模板；打印机配置服务** |

***

## 四、面试可展开的技术点

1. **如何设计并实现前后端 API 签名机制？**\
   → 参数升序、MD5、密钥解密、GET/POST 差异化处理

2. **Vue 中如何实现多级菜单的递归渲染与权限控制？**\
   → 树形数据、递归组件、路由守卫、`formateMenu` 扁平化

3. **KeepAlive 缓存数量受限时如何处理？**\
   → maxCacheNum、动态 include、Tab 关闭时 remove、iframe 单独管理

4. **虚拟滚动的核心原理是什么？**\
   → 可视区域计算、DOM 复用、transform 定位、动态高度累加

5. **大型 Vue 项目的构建优化有哪些？**\
   → splitChunks、按需加载、内存限制、sourceMap 策略

6. **如何安全地与 iframe 内第三方页面通信？**\
   → postMessage、token 传递、targetOrigin 限制、生命周期清理

7. **企业级打印方案如何适配 PC、移动端、无插件浏览器？**\
   → Lodop 控件、CLodop 云打印、needCLodop 判断、Pad HTTPS 服务、$print 纯浏览器方案、PDF iframe 打印

***

## 五、总结

本项目综合了 **企业级权限、API 安全、大型表格、虚拟滚动、多 Tab 缓存、iframe 集成、多端打印、构建优化** 等前端常见难点，适合在面试中结合实际模块展开说明解决方案与个人贡献。
