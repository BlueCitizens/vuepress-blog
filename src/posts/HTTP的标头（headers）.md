---
icon: pen-to-square
date: 2023-11-04
category:
  - 网络
tag:
  - HTTP
---


# HTTP的标头（headers）

通用标头
实体标头：可以出现在http的请求头和响应头中。
请求标头：客户端发送http请求到服务器所使用的字段。
响应标头：服务端返回给客户端所使用的字段。

## User-Agent
在python中，调用request包默认使用的User-Agent是python-requests/xxx，等于是直接告诉网站你在使用爬虫程序，因此通常会伪装成浏览器的请求。

## Content-Encoding
使用指定的编码方式压缩原始媒体数据，减少传输开销。比如：
```
Content-Encoding: gzip
```

## Quote
这个网站非常全面的解释了每种标头的含义[HTTP 标头（header）- HTTP | MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers)