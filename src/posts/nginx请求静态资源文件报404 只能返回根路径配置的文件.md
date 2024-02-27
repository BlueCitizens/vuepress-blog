---
icon: pen-to-square
date: 2021-12-01
category:
  - 运维
tag:
  - Linux
  - Nginx
---

# nginx请求静态资源文件报404 只能返回根路径配置的文件

## nginx配置location时的问题
之前都是在请求为根目录的情况下配置nginx，即“location / ”下，使用root配置文件路径。
```
location / {
                root    /mnt/c;
        }
```
这种情况下，请求localhost:80/返回的确实是/mnt/c。如果改成
```
location /test/ {
                root    /mnt/c;
        }
```
发现报404了，但文件路径确实存在。原因是这样请求后返回的文件路径是/mnt/c/test/，**即root + location**。因此无论如何都不可能找到文件。

## 解决方案

### 将文件放在正确的路径，这个不用多说了

### 用alias代替root配置文件路径
```
location /test/ {
                root    /mnt/c/;#目录最后要加上/
        }
```
注意配置文件目录时，路径的最后要加上斜杠否则访问不到。

*通常在location / 中配置root，在location /\* 中配置alias。*