import{_ as s,c as a,o as e,d as n}from"./app.a55f52f9.js";const d=JSON.parse('{"title":"Promise \u76F8\u5173\u77E5\u8BC6","description":"","frontmatter":{},"headers":[{"level":2,"title":"\u4F7F\u7528reduce\u8FDB\u884CPromise\u6392\u961F\u6267\u884C\uFF0C\u6309\u7167\u987A\u5E8F\u8C03\u63A5\u53E3","slug":"\u4F7F\u7528reduce\u8FDB\u884Cpromise\u6392\u961F\u6267\u884C\uFF0C\u6309\u7167\u987A\u5E8F\u8C03\u63A5\u53E3"}],"relativePath":"javascript/promise.md","lastUpdated":1678332303000}'),o={name:"javascript/promise.md"},p=n(`<h1 id="promise-\u76F8\u5173\u77E5\u8BC6" tabindex="-1">Promise \u76F8\u5173\u77E5\u8BC6 <a class="header-anchor" href="#promise-\u76F8\u5173\u77E5\u8BC6" aria-hidden="true">#</a></h1><h2 id="\u4F7F\u7528reduce\u8FDB\u884Cpromise\u6392\u961F\u6267\u884C\uFF0C\u6309\u7167\u987A\u5E8F\u8C03\u63A5\u53E3" tabindex="-1">\u4F7F\u7528reduce\u8FDB\u884CPromise\u6392\u961F\u6267\u884C\uFF0C\u6309\u7167\u987A\u5E8F\u8C03\u63A5\u53E3 <a class="header-anchor" href="#\u4F7F\u7528reduce\u8FDB\u884Cpromise\u6392\u961F\u6267\u884C\uFF0C\u6309\u7167\u987A\u5E8F\u8C03\u63A5\u53E3" aria-hidden="true">#</a></h2><div class="language-js"><span class="copy"></span><pre><code><span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> promises </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> [</span><span style="color:#89DDFF;">.....</span><span style="color:#A6ACCD;">]</span></span>
<span class="line"><span style="color:#A6ACCD;">promises</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">reduce</span><span style="color:#A6ACCD;">(</span></span>
<span class="line"><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">prev</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> next</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> prev</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">then</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> next</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">action</span><span style="color:#A6ACCD;">())</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span></span>
<span class="line"><span style="color:#FFCB6B;">Promise</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">resolve</span><span style="color:#A6ACCD;">()</span></span>
<span class="line"><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span></code></pre></div>`,3),l=[p];function r(t,c,i,A,D,C){return e(),a("div",null,l)}var F=s(o,[["render",r]]);export{d as __pageData,F as default};
