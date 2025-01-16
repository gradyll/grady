import{_ as e,c as s,a3 as l,o}from"./chunks/framework.CqcJeF4B.js";const h=JSON.parse('{"title":"Rollup","description":"","frontmatter":{},"headers":[],"relativePath":"rollup/index.md","filePath":"rollup/index.md","lastUpdated":1736991331000}'),n={name:"rollup/index.md"};function t(i,a,p,r,d,c){return o(),s("div",null,a[0]||(a[0]=[l(`<h1 id="rollup" tabindex="-1">Rollup <a class="header-anchor" href="#rollup" aria-label="Permalink to &quot;Rollup&quot;">​</a></h1><h2 id="overview-什么是rollup" tabindex="-1">Overview(什么是Rollup) <a class="header-anchor" href="#overview-什么是rollup" aria-label="Permalink to &quot;Overview(什么是Rollup)&quot;">​</a></h2><p><code>Rollup</code> 是 <code>JavaScript</code> 的模块捆绑器，它将小段代码编译成更大更复杂的代码，比如库或应用程序。</p><h2 id="install-安装" tabindex="-1">Install(安装) <a class="header-anchor" href="#install-安装" aria-label="Permalink to &quot;Install(安装)&quot;">​</a></h2><p><code>npm install --global rollup</code></p><h2 id="quick-start-快速开始" tabindex="-1">Quick Start (快速开始) <a class="header-anchor" href="#quick-start-快速开始" aria-label="Permalink to &quot;Quick Start (快速开始)&quot;">​</a></h2><p><code>Rollup</code>既可以通过带有可选配置文件的命令行接口使用，也可以通过其JavaScript API使用。</p><p>这些命令假设应用程序的入口点名为main.js，并且您希望将所有导入编译到一个名为bundle.js的文件中。</p><p>编译为浏览器：<code>For browsers:</code></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># compile to a &lt;script&gt; containing a self-executing function (&#39;iife&#39;)</span></span>
<span class="line"><span>rollup main.js --file bundle.js --format iife</span></span></code></pre></div><p>编译为node环境：<code>For Node.js:</code></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># compile to a CommonJS module (&#39;cjs&#39;)</span></span>
<span class="line"><span>rollup main.js --file bundle.js --format cjs</span></span></code></pre></div><p>编译为浏览器和node环境：<code>For both browsers and Node.js:</code></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># UMD format requires a bundle name</span></span>
<span class="line"><span>rollup main.js --file bundle.js --format umd --name &quot;myBundle&quot;</span></span></code></pre></div><h2 id="tree-shaking" tabindex="-1">Tree-shaking <a class="header-anchor" href="#tree-shaking" aria-label="Permalink to &quot;Tree-shaking&quot;">​</a></h2><p>除了支持ES模块的使用外，Rollup还静态地分析您正在导入的代码，并将排除实际上没有使用的任何代码。这允许您在现有工具和模块的基础上进行构建，而无需增加额外的依赖项或增加项目的规模。</p>`,16)]))}const m=e(n,[["render",t]]);export{h as __pageData,m as default};
