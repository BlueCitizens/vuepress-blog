---
icon: pen-to-square
date: 2021-03-11
category:
  - 开发
tag:
  - 流媒体
  - SRS
---

# SRS简单部署

## 安装

按照github上的说明，先将项目clone到本地编译。据说有安装包方法，没有尝试

```
clone https://github.com/ossrs/srs
```

等待源码下载。。。

进入 srs/trunk 目录下

```
cd srs/trunk
```

编译

```
sudo ./configure && make
```

脚本会自动安装所需的相关依赖。

编译过程报了两次错，
第一次是CherryPy 重新编译了一次过了。。。回忆可能是因为没有sudo给权限，也可能是网络相关玄学原因

第二个错是openssl报错，貌似是系统和脚本指定的版本（openssl-1.1.0e）有冲突

查了一下已经有人踩过坑了，使用参数指定编译使用的openssl版本即可。

安装openssl

```
sudo apt-get install libssl-dev
```

指定系统默认的openssl编译

```
./configure --use-sys-ssl && make
```

顺利通过

*好像也可以通过修改编译脚本来达到效果，ctrlF了一下感觉略麻烦（看不懂脚本配置）没有尝试*

## 启动SRS

依然留在trunk下，尝试第一次启动吧


```
./objs/srs -c conf/srs.conf
```

关于srs的启动参数后面再说。特别是配置文件srs.conf

修改启动参数需要杀掉进程后重启

```
ps –ef|grep srs
sudo kill -9 进程
```

## 推流

安装ffmpeg

```
sudo apt-get install ffmpeg
```

在指定视频目录下运行ffmpeg

```
ffmpeg -re -i test.mp4 -c copy -f flv rtmp://172.16.110.110:1935/live/livestream
```

用支持rtmp的播放器就ok了

*VLC media player*

*Potplayer*