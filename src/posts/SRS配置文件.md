---
icon: pen-to-square
date: 2021-03-13
category:
  - 开发
tag:
  - 流媒体
  - SRS
---

# SRS配置文件

打开srs的配置文件

vim srs/trunk/conf/srs.conf

原生默认的配置

```
# main config for srs.
# @see full.conf for detail config.

listen              1935;
max_connections     1000;
srs_log_tank        file;
srs_log_file        ./objs/srs.log;
daemon              on;
http_api {
    enabled         on;
    listen          1985;
}
http_server {
    enabled         on;
    listen          8080;
    dir             ./objs/nginx/html;
}
stats {
    network         0;
    disk            sda sdb xvda xvdb;
}
vhost __defaultVhost__ {
    hls {
        enabled         on;
    }
    http_remux {
        enabled     on;
        mount       [vhost]/[app]/[stream].flv;
    }
}
```

对以上配置文件解说，并增加一些目前缺省的常用配置

*配置文件中用井号‘#’作为注释符，m3u8文件也类似*

```
vhost __defaultVhost__ {
    hls {

        enabled         on; 
		#是否开启HLS（网上说是默认关闭的，我的是默认开启，若关闭有什么影响？）

		hls_fragment 	10;
		#切片ts文件时长 单位：秒（s）

		hls_window		60;
		#m3u8中保存多少个切片文件

		hls_cleanup	off;
		#自动清除ts文件开关
		
    }
    http_remux {
        enabled     on;
        mount       [vhost]/[app]/[stream].flv;
    }
}
```