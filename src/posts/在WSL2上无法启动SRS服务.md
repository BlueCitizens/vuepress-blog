---
icon: pen-to-square
date: 2021-03-17
category:
  - 运维
tag:
  - 流媒体
  - SRS
---

# 在WSL2上无法启动srs服务

## 环境

WSL2 Ubuntu 20.04 LTS

## 问题

通过./objs/srs -c conf/srs.conf启动SRS服务。控制台没有报异常，正常输出了以下几行：

```Shell
bluecitizen@DESKTOP-A2E34TM:~/srs/trunk$ ./objs/srs -c conf/srs.conf

[2021-04-01 12:30:17.996][Trace][7308][0] XCORE-SRS/3.0.158(OuXuli)
[2021-04-01 12:30:17.997][Trace][7308][0] config parse complete
[2021-04-01 12:30:17.998][Trace][7308][0] you can check log by: tail -f ./objs/srs.log (@see https://github.com/ossrs/srs/wiki/v1_CN_SrsLog)
[2021-04-01 12:30:17.998][Trace][7308][0] please check SRS by: ./etc/init.d/srs status
```

然后启动ffmpeg推流，报错1935端口拒绝连接

```Shell
bluecitizen@DESKTOP-A2E34TM:/mnt/d/dld$ ffmpeg -re -i rika-police.mp4 -c copy -f flv rtmp://172.17.162.184:1935/live/livestream

[tcp @ 0x557523daad00] Connection to tcp://172.17.162.184:1935 failed: Connection refused
[rtmp @ 0x557523daa340] Cannot open connection tcp://172.17.162.184:1935
rtmp://172.17.162.184:1935/live/livestream: Connection refused
```

一脸懵逼的我习惯性百度了一圈，没有找到合理的解释。

于是乎只能自己动手检查，先telnet一下端口：

```Shell
bluecitizen@DESKTOP-A2E34TM:/mnt/d/dld$ telnet localhost 1935

Trying 127.0.0.1...
telnet: Unable to connect to remote host: Connection refused
```

注意这里用了回环地址，因为WSL是可以用回环地址的（虚拟机和本机共享）。但WSL的回环地址总有各种bug，于是查找进程：

```Shell
bluecitizen@DESKTOP-A2E34TM:/mnt/d/dld$ ps aux|grep srs

bluecit+  7272  0.0  0.0   8160   728 pts/1    S+   11:31   0:00 grep --color=auto srs
```

进一步查询srs的pid文件，发现是failed，于是又重新启动一次，依然输出了正常的启动信息，但进程信息无效。

```Shell
bluecitizen@DESKTOP-A2E34TM:~/srs/trunk$ ./etc/init.d/srs status
Error: No pid file /home/bluecitizen/srs/trunk/objs/srs.pid[FAILED]
bluecitizen@DESKTOP-A2E34TM:~/srs/trunk$ ./objs/srs -c conf/srs.conf
[2021-04-01 12:30:17.996][Trace][7308][0] XCORE-SRS/3.0.158(OuXuli)
[2021-04-01 12:30:17.997][Trace][7308][0] config parse complete
[2021-04-01 12:30:17.998][Trace][7308][0] you can check log by: tail -f ./objs/srs.log (@see https://github.com/ossrs/srs/wiki/v1_CN_SrsLog)
[2021-04-01 12:30:17.998][Trace][7308][0] please check SRS by: ./etc/init.d/srs status
bluecitizen@DESKTOP-A2E34TM:~/srs/trunk$ ./etc/init.d/srs status
Error: No pid file /home/bluecitizen/srs/trunk/objs/srs.pid[FAILED]
```

不信邪的我又手动进入了相关目录，真的没有。

随便尝试进入root用户启动，居然成功了，推流也恢复正常：

```Shell
root@DESKTOP-A2E34TM:/home/bluecitizen/srs/trunk/objs/nginx# cd ..
root@DESKTOP-A2E34TM:/home/bluecitizen/srs/trunk/objs# cd ..
root@DESKTOP-A2E34TM:/home/bluecitizen/srs/trunk# ./objs/srs -c conf/srs.conf
[2021-04-01 12:36:49.131][Trace][7376][0] XCORE-SRS/3.0.158(OuXuli)
[2021-04-01 12:36:49.131][Trace][7376][0] config parse complete
[2021-04-01 12:36:49.131][Trace][7376][0] you can check log by: tail -f ./objs/srs.log (@see https://github.com/ossrs/srs/wiki/v1_CN_SrsLog)
[2021-04-01 12:36:49.132][Trace][7376][0] please check SRS by: ./etc/init.d/srs status
root@DESKTOP-A2E34TM:/home/bluecitizen/srs/trunk# ./etc/init.d/srs status
SRS(pid 7378) is running.                                  [  OK  ]
```

也看到了熟悉的进程：

```Shell
root@DESKTOP-A2E34TM:/mnt/d/dld# ps aux|grep srs
root      7378  0.1  0.2  25104 18936 pts/1    S    12:36   0:13 ./objs/srs -c conf/srs.conf
root      7397  0.0  0.0   8160   732 pts/1    S+   15:07   0:00 grep --color=auto srs
```

## 总结

在服务器的Ubuntu 20.04 LTS上，即便没有使用root用户也可以正常启动。排除部署过程的差别，很有可能还是WSL本身的问题。。。第一次用WSL作为生产力折腾就出问题，很难让人放心用下去啊。。。

## Quote

https://ask.csdn.net/questions/4077478