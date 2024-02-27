---
icon: pen-to-square
date: 2022-08-24
category:
  - 运维
tag:
  - Linux
---

Ubuntu20.04的官方apt镜像源中已经不提供MySQL5.X了，目前至少都是8.0起步。更离谱的是腾讯云默认的镜像源中也没有5.7版本。这不禁让我面露难色：难道全世界除了我都已经过渡到新版本的MySQL了吗？
<!-- more -->

# 在Ubuntu20.04下安装MySQL5.7并建立远程连接

## 修改镜像源

实测阿里镜像源可以正常安装。你也可以尝试其他镜像源，但不保证可用。
```
#  阿里源
deb http://mirrors.aliyun.com/ubuntu/ bionic main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-security main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-updates main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-proposed main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-backports main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-security main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-updates main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-proposed main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-backports main restricted universe multiverse
```
### 如何修改镜像源
```
# 将原来的source文件复制多一份加上.old，方便恢复
sudo cp /etc/apt/sources.list /etc/apt/sources.list.old

# 修改source文件的内容
sudo vim /etc/apt/sources.list
```
提示：在命令行模式下先按```gg```使光标跳转到第一行再按```dG```可以快速清空所有内容。

将上文的阿里源全部粘贴进去并保存。回到控制台，修改完source文件需要更新一下镜像源才能安装：
```
# 更新镜像源
sudo apt update

# 安装MySQL5.7，一共有三个包，最后一个选装
sudo apt install mysql-server-5.7 
sudo apt install mysql-client-5.7

# 使用c/c++等语言操作mysql的动态链接库时需要
sudo apt install libmysqlclient-dev
```
安装过程直接结束，中间似乎没有提示设置密码……可能Ubuntu server看不到吧，按理说我没有安装过也不应该有卸载残余。总之需要手动设置。

先确认一下是否安装好：
```
mysql -V # 查看mysql版本
netstat -tap | grep mysql # 查看mysql服务
```

先去```/etc/mysql```下找```debian.cnf```文件，预览一下看看默认的账户密码是什么。

```
sudo cat /etc/mysql/debian.cnf

# 下面是控制台打印的结果
# Automatically generated for Debian scripts. DO NOT TOUCH!
[client]
host     = localhost
user     = debian-sys-maint
password = ABCDEFG
socket   = /var/run/mysqld/mysqld.sock
[mysql_upgrade]
host     = localhost
user     = debian-sys-maint
password = ABCDEFG
socket   = /var/run/mysqld/mysqld.sock
```
用这里的user和password登录MySQL。
```
mysql -udebian-sys-maint -pABCDEFG
```
然后设置新密码。
```
# 切换到mysql库
use mysql;

# 设置密码
update user set authentication_string=PASSWORD("新密码") where user='root';

# 刷新
flush privileges;

# 退出mysql回到控制台
quit;

# 重启mysql数据库
sudo service mysql restart
 
# 使用新密码登陆mysql 
mysql -uroot -p123456
```

## 用Navicat连接远程数据库
先登录MySQL，并切换到mysql库。
```
# 切换到mysql库
use mysql;

# 看查询结果中是否有host字段值为 %
select host from user where user = 'root';

+-----------+
| host      |
+-----------+
| %         |
| localhost |
+-----------+
```
可以看到root对应的host值有两个，一个是百分号%，这个就对应着远程登录；另一个是localhost，代表着本地登录。可能还会有其他的，与本文无关。

如果没有%，就无法正常连接。继续在mysql库运行如下语句：
```
update user set host = '%' where user = 'root';

# 刷新权限
flush privileges
```
为其增加一个%即可，别忘了刷新。最后记得要在服务器的防火墙设置里开放3306端口。

## 连接失败，报2003错误
```
2003-cant connection to mysql server on ‘your ip’（10061 unknown error）
```
这个错有很多可能，我遇到的情况是本地回环地址配置有问题。在下面的配置文件里找一个叫做```[mysqld]```的段落。

```
# 如果这里面没有，就在它链接到的配置文件里找
cat -n /etc/mysql/my.cnf

# 这是我最终找到的配置文件
cat /etc/mysql/mysql.conf.d/mysqld.cnf 
```
紧接着在```[mysqld]```下面找一个叫```bind-address```的字段。如果是127.0.0.1，那么将它直接注释掉。再次重启mysql服务，应该就能连接了。


## Quote
[ubuntu 20.04安装mysql 5.7](https://blog.csdn.net/u013519290/article/details/122012747)

[Ubuntu16安装mysql5.7未提示输入密码，安装后修改mysql密码默认密码](https://blog.csdn.net/m0_67390788/article/details/124090360)

[Ubuntu 20.04 安装和配置MySql5.7的详细教程](https://www.jb51.net/article/202399.htm)

[MySQL远程连接报错2003-cant connection to mysql server on ‘IP’（10061 unknown error）](https://blog.csdn.net/alwaysbefine/article/details/116332945)