import{_ as a,o as e,c as r,Q as s}from"./chunks/framework.64a3e084.js";const m=JSON.parse('{"title":"Rust 开发过程的问题集","description":"","frontmatter":{},"headers":[],"relativePath":"rust/questinos.md","lastUpdated":1704698440000}'),t={name:"rust/questinos.md"},o=s(`<h1 id="rust-开发过程的问题集" tabindex="-1">Rust 开发过程的问题集 <a class="header-anchor" href="#rust-开发过程的问题集" aria-label="Permalink to &quot;Rust 开发过程的问题集&quot;">​</a></h1><h2 id="q1-cargo-build-时-出现-network-error" tabindex="-1">Q1: cargo build 时 出现 network error <a class="header-anchor" href="#q1-cargo-build-时-出现-network-error" aria-label="Permalink to &quot;Q1: cargo build 时 出现 network error&quot;">​</a></h2><h3 id="问题描述" tabindex="-1">问题描述 <a class="header-anchor" href="#问题描述" aria-label="Permalink to &quot;问题描述&quot;">​</a></h3><p>warning: spurious network error (2 tries remaining): failed to connect to github.com: Operation timed out; class=Os (2)</p><h3 id="解决方法" tabindex="-1">解决方法 <a class="header-anchor" href="#解决方法" aria-label="Permalink to &quot;解决方法&quot;">​</a></h3><p>在文件 /etc/resolv.conf 中增加了阿里的dns域名服务器， 问题没有解决;</p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">nameserver</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">223.5.5.5</span></span>
<span class="line"><span style="color:#FFCB6B;">nameserver</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">223.6.6.6</span></span>
<span class="line"></span></code></pre></div><h3 id="相关文章" tabindex="-1">相关文章 <a class="header-anchor" href="#相关文章" aria-label="Permalink to &quot;相关文章&quot;">​</a></h3><p><a href="https://www.cnblogs.com/QuLory/p/13992013.html" target="_blank" rel="noreferrer">在使用cargo进行复杂软件安装时， 依赖比较多的库， 需要快速下载</a></p>`,9),n=[o];function l(c,i,p,d,h,u){return e(),r("div",null,n)}const b=a(t,[["render",l]]);export{m as __pageData,b as default};