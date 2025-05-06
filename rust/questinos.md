---
url: /rust/questinos.md
---
# Rust 开发过程的问题集

## Q1: cargo build 时 出现 network error

### 问题描述

warning: spurious network error (2 tries remaining): failed to connect to github.com: Operation timed out; class=Os (2)

### 解决方法

在文件 /etc/resolv.conf 中增加了阿里的dns域名服务器， 问题没有解决;

```sh
nameserver 223.5.5.5
nameserver 223.6.6.6
```

### 相关文章

[在使用cargo进行复杂软件安装时， 依赖比较多的库， 需要快速下载](https://www.cnblogs.com/QuLory/p/13992013.html)
