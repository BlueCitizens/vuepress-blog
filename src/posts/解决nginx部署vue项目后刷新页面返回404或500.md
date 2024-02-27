---
icon: pen-to-square
date: 2020-06-23
category:
  - 运维
tag:
  - Nginx
  - Linux
  - Vue
---

# 解决nginx部署vue项目后刷新页面返回404或500

官方的Router文档中有相关解决方案：https://router.vuejs.org/zh/guide/essentials/history-mode.html#%E5%90%8E%E7%AB%AF%E9%85%8D%E7%BD%AE%E4%BE%8B%E5%AD%90

原因：vue的history模式下，切换路由本质是通过js操作window.history方法来改变浏览器地址栏里的路径，并没有发起http请求。但是当我直接在浏览器里输入这个地址的时候，其实是对服务器发起了http请求，而这个目标（即http请求的资源）在服务器上根本不存在，所以nginx会返回404。同理，500就是路径本身有错误。

解决原理：在服务端增加一个覆盖所有情况的候选资源。如果 URL 匹配不到任何静态资源，则应该返回同一个 index.html 页面，这个页面就是app依赖的页面。

官方对nginx的解决方法
```
location / {
  try_files $uri $uri/ /index.html;
}
```
例如我的nginx.conf
```
server {
	listen 80;
	#监听端口
	root /usr/share/nginx/html;
	#静态资源所在目录
	index index.html;
	#默认主页
	charset utf-8;

	location / {#这一段location是新加入的配置
		root /usr/share/nginx/html;
		try_files $uri $uri/ /index.html;
		index index.html;
	}

	location /prod-api/ {
		rewrite  /prod-api/(.*)  /$1  break;
		proxy_pass http://192.168.0.1:8081;
	} 
	#/-资源路径 有uri 访问uri没有就访问index.html
}
```

*VUE的router[mode: history]模式在开发环境下使用的服务器为node，在Dev环境中不会有问题。但在在服务器部署生产环境的nginx中需要自行配置。*