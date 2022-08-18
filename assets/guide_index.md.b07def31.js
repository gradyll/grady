import{_ as s,c as a,o as n,a as l}from"./app.4979c01f.js";var p="/grady/assets/cz_alt.1b468d62.jpg";const d=JSON.parse('{"title":"Commitizen\u89C4\u8303\u5316\u63D0\u4EA4\u4EE3\u7801","description":"","frontmatter":{},"headers":[{"level":2,"title":"\u5B89\u88C5 husky \u4F9D\u8D56","slug":"\u5B89\u88C5-husky-\u4F9D\u8D56"},{"level":2,"title":"\u5B89\u88C5 commitlint","slug":"\u5B89\u88C5-commitlint"},{"level":2,"title":"\u9879\u76EE\u4E2D\u5B89\u88C5 husky","slug":"\u9879\u76EE\u4E2D\u5B89\u88C5-husky"},{"level":2,"title":"\u751F\u6210 commitlint \u914D\u7F6E\u6587\u4EF6","slug":"\u751F\u6210-commitlint-\u914D\u7F6E\u6587\u4EF6"},{"level":2,"title":"\u5728 packag.json \u4E2D\u6DFB\u52A0","slug":"\u5728-packag-json-\u4E2D\u6DFB\u52A0"},{"level":2,"title":"Add Hook","slug":"add-hook"}],"relativePath":"guide/index.md","lastUpdated":1660817699000}'),o={name:"guide/index.md"},e=l(`<h1 id="commitizen\u89C4\u8303\u5316\u63D0\u4EA4\u4EE3\u7801" tabindex="-1">Commitizen\u89C4\u8303\u5316\u63D0\u4EA4\u4EE3\u7801 <a class="header-anchor" href="#commitizen\u89C4\u8303\u5316\u63D0\u4EA4\u4EE3\u7801" aria-hidden="true">#</a></h1><h2 id="\u5B89\u88C5-husky-\u4F9D\u8D56" tabindex="-1">\u5B89\u88C5 <code>husky</code> \u4F9D\u8D56 <a class="header-anchor" href="#\u5B89\u88C5-husky-\u4F9D\u8D56" aria-hidden="true">#</a></h2><div class="language-"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;"># \u5728\u9879\u76EE\u7684\u6839\u8DEF\u5F84\u4E0B\uFF08\u5373.git\u7684\u6240\u5728\u76EE\u5F55\uFF09</span></span>
<span class="line"><span style="color:#A6ACCD;">npm install --save-dev husky</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><h2 id="\u5B89\u88C5-commitlint" tabindex="-1">\u5B89\u88C5 <code>commitlint</code> <a class="header-anchor" href="#\u5B89\u88C5-commitlint" aria-hidden="true">#</a></h2><div class="language-"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;"># \u5728 node_modules\u7684\u540C\u7EA7\u4E0B\u5B89\u88C5</span></span>
<span class="line"><span style="color:#A6ACCD;">npm install --save-dev @commitlint/config-conventional @commitlint/cli @commitlint/prompt-cli</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><h2 id="\u9879\u76EE\u4E2D\u5B89\u88C5-husky" tabindex="-1">\u9879\u76EE\u4E2D\u5B89\u88C5 <code>husky</code> <a class="header-anchor" href="#\u9879\u76EE\u4E2D\u5B89\u88C5-husky" aria-hidden="true">#</a></h2><div class="language-sh"><span class="copy"></span><pre><code><span class="line"><span style="color:#676E95;font-style:italic;"># \u5728\u9879\u76EE\u7684\u6839\u76EE\u5F55\uFF08\u5373.git\u7684\u6240\u5728\u76EE\u5F55\uFF09</span></span>
<span class="line"><span style="color:#A6ACCD;">npx husky install</span></span>
<span class="line"></span>
<span class="line"></span></code></pre></div><h2 id="\u751F\u6210-commitlint-\u914D\u7F6E\u6587\u4EF6" tabindex="-1">\u751F\u6210 <code>commitlint</code> \u914D\u7F6E\u6587\u4EF6 <a class="header-anchor" href="#\u751F\u6210-commitlint-\u914D\u7F6E\u6587\u4EF6" aria-hidden="true">#</a></h2><div class="language-sh"><span class="copy"></span><pre><code><span class="line"><span style="color:#82AAFF;">echo</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">module.exports = {extends: [&#39;@commitlint/config-conventional&#39;]};</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;"> commitlint.config.js</span></span>
<span class="line"></span></code></pre></div><h2 id="\u5728-packag-json-\u4E2D\u6DFB\u52A0" tabindex="-1">\u5728 <code>packag.json</code> \u4E2D\u6DFB\u52A0 <a class="header-anchor" href="#\u5728-packag-json-\u4E2D\u6DFB\u52A0" aria-hidden="true">#</a></h2><div class="language-json"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;"># \u7B2C\u4E00\u5C42\u7EA7</span></span>
<span class="line"><span style="color:#A6ACCD;">husky</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">: {</span></span>
<span class="line"><span style="color:#C3E88D;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;">hooks</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">: {</span></span>
<span class="line"><span style="color:#C3E88D;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;">commit-msg</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">: </span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;">commitlint -E HUSKY_GIT_PARAMS</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#C3E88D;">  }</span></span>
<span class="line"><span style="color:#C3E88D;">}</span></span>
<span class="line"></span></code></pre></div><h2 id="add-hook" tabindex="-1">Add Hook <a class="header-anchor" href="#add-hook" aria-hidden="true">#</a></h2><div class="language-"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;">npx husky add .husky/commit-msg &#39;npx --no-install commitlint --edit $1&#39;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>\u4EE5\u4E0A\u5B89\u88C5\u5B8C\u6210\u4E4B\u540E\u8FD8\u9700\u8981\u5B89\u88C5\u4E00\u4E2A\u5E93</p></div><ol><li>\u5168\u5C40\u5B89\u88C5 <code>Commitizen</code></li></ol><div class="language-"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;">npm install -g commitizen</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><ol start="2"><li>\u5B89\u88C5\u5E76\u914D\u7F6E <code>cz-customizable</code> \u63D2\u4EF6</li></ol><div class="language-"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;">npm i cz-customizable</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><ol start="3"><li>\u6DFB\u52A0\u4EE5\u4E0B\u914D\u7F6E\u5230 <code>package.json</code> \u4E2D</li></ol><div class="language-json"><span class="copy"></span><pre><code><span class="line"><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">config</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;">: </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">commitizen</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">path</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">node_modules/cz-customizable</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><ol start="4"><li>\u9879\u76EE\u6839\u76EE\u5F55\u4E0B\u521B\u5EFA <code>.cz-config.js</code> \u81EA\u5B9A\u4E49\u63D0\u793A\u6587\u4EF6</li></ol><div class="language-js"><span class="copy"></span><pre><code><span class="line"><span style="color:#89DDFF;">module.exports</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// \u53EF\u9009\u7C7B\u578B</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">types</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> [</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;"> </span><span style="color:#F07178;">value</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">feat</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#F07178;">name</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">feat:     \u65B0\u529F\u80FD</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;"> </span><span style="color:#F07178;">value</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">fix</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#F07178;">name</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">fix:      \u4FEE\u590D</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;"> </span><span style="color:#F07178;">value</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">docs</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#F07178;">name</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">docs:     \u6587\u6863\u53D8\u66F4</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;"> </span><span style="color:#F07178;">value</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">style</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#F07178;">name</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">style:    \u4EE3\u7801\u683C\u5F0F(\u4E0D\u5F71\u54CD\u4EE3\u7801\u8FD0\u884C\u7684\u53D8\u52A8)</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#F07178;">value</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">refactor</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#F07178;">name</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">refactor: \u91CD\u6784(\u65E2\u4E0D\u662F\u589E\u52A0feature\uFF0C\u4E5F\u4E0D\u662F\u4FEE\u590Dbug)</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;"> </span><span style="color:#F07178;">value</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">perf</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#F07178;">name</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">perf:     \u6027\u80FD\u4F18\u5316</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;"> </span><span style="color:#F07178;">value</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">test</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#F07178;">name</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">test:     \u589E\u52A0\u6D4B\u8BD5</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;"> </span><span style="color:#F07178;">value</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">chore</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#F07178;">name</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">chore:    \u6784\u5EFA\u8FC7\u7A0B\u6216\u8F85\u52A9\u5DE5\u5177\u7684\u53D8\u52A8</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;"> </span><span style="color:#F07178;">value</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">revert</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#F07178;">name</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">revert:   \u56DE\u9000</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;"> </span><span style="color:#F07178;">value</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">build</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#F07178;">name</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">build:    \u6253\u5305</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">  ]</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// \u6D88\u606F\u6B65\u9AA4</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">messages</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">type</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">\u8BF7\u9009\u62E9\u63D0\u4EA4\u7C7B\u578B:</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">customScope</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">\u8BF7\u8F93\u5165\u4FEE\u6539\u8303\u56F4(\u53EF\u9009):</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">subject</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">\u8BF7\u7B80\u8981\u63CF\u8FF0\u63D0\u4EA4(\u5FC5\u586B):</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">body</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">\u8BF7\u8F93\u5165\u8BE6\u7EC6\u63CF\u8FF0(\u53EF\u9009):</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">footer</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">\u8BF7\u8F93\u5165\u8981\u5173\u95ED\u7684issue(\u53EF\u9009):</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">confirmCommit</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">\u786E\u8BA4\u4F7F\u7528\u4EE5\u4E0A\u4FE1\u606F\u63D0\u4EA4\uFF1F(y/n/e/h)</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// \u8DF3\u8FC7\u95EE\u9898</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">skipQuestions</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> [</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">body</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">footer</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;">]</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;">// subject\u6587\u5B57\u957F\u5EA6\u9ED8\u8BA4\u662F72</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">subjectLimit</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">72</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><ol start="5"><li>\u4F7F\u7528 <code>git cz</code> \u4EE3\u66FF <code>git commit</code>,\u5373\u53EF\u770B\u5230\u63D0\u793A\u5185\u5BB9 <img src="`+p+'" alt="git cz\u63D0\u793A"></li></ol>',23),c=[e];function t(D,r,y,F,C,i){return n(),a("div",null,c)}var m=s(o,[["render",t]]);export{d as __pageData,m as default};