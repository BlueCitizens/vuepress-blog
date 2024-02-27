---
icon: pen-to-square
date: 2022-04-04
category:
  - 运维
tag:
  - Linux
---

# Ubuntu常用操作和常见问题

## 第一次使用su（root密码）

安装后第一次使用su需要先设置root用户的密码。
```dash
sudo passwd root
```
根据提示输入两次密码即可。第二次开始只要：
```dash
su
```
输入密码进入root用户操作命令行即可。

### 普通用户下sudo和root用户的区别

https://www.linuxidc.com/Linux/2008-01/10685.htm

### su 和 su - 的区别

https://www.cnblogs.com/yangzhilong/p/5347665.html

## 软件包手动安装（debian系）

### 安装

```dash
sudo dpkg -i 软件包名.deb
```

### 卸载

```dash
sudo apt-get remove 软件包名
```

https://help.ubuntu.com/kubuntu/desktopguide/zh_CN/manual-install.html

https://www.cnblogs.com/longyuan-z/p/7739864.html

### update

```dash
sudo apt-get update
```

https://www.cnblogs.com/lixiangfu/p/11220493.html

## 查端口占用和杀进程

```bash
#sudo lsof -i:[端口号]
sudo lsof -i:8080

#根据pid杀死进程
sudo kill [pid]
#正常关闭失败尝试强制关闭
sudo kill -9 [pid]
```

## 删除目录下所有文件包括子目录

```bash
rm -rf [路径]
```

## 查看内核版本（i384，amd64，arm等）

命令行```$ arch```

内核版本的区别：
https://www.cnblogs.com/totems/p/3198287.html

## 解压文件

.tar.gz

```bash
tar -zxvf [xxx.tar.gz] # 解压
tar -zcvf [xxx.tar.gz] [Dir] # 以路径Dir及所有子文件（夹）建立压缩文件
tar -C [Dir] -zxvf xxx.tar.gz # 解压到指定路径
```

.zip

```bash
# 安装zip解压工具
sudo apt-get install unzip
unzip xxx.zip # 解压到当前路径
unzip -d [Dir] [xxx.zip] # 解压到指定路径

# 参数
-v 查看文件目录列表和压缩比，不解压
-d 将文件解压到指定目录中
-n 不覆盖原来已经存在的文件
-o 覆盖已存在的文件并且不需要用户确认
-t 检查压缩包损坏
```
https://www.jianshu.com/p/1d2d3c6e2bf0https://www.jianshu.com/p/1d2d3c6e2bf0