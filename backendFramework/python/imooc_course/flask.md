---
url: /grady/backendFramework/python/imooc_course/flask.md
---
# Flask

> Flask 是一个轻量级 WSGI 框架，它使用 Python 进行开发，并且非常容易使用。

## 安装 Flask

```bash

pip install flask

```

## Cookie

Cookie 就是浏览器用来存储用户信息的一个小文件。所以 cookie 可以理解成我们为我们浏览一些网站的身份证。
cookie的存储量很小，一般不超过4KB所以 cookie 并不会保存很多信息，一般用来存储登录状态。

cookie 是以键值对进行表示的

## 作用

cookie的存储分为会话性存储和持久性存储。

如果 cookie 为会话性，那么 cookie仅会在客户端的内存中，如果我们关闭客户端时 cookie 也就会失效了。

如果 Cooke 为持久性，那么 cookie 会保存在客户端的硬盘上，如果我们关闭客户端时 cookie 也不会失效。
