---
icon: pen-to-square
date: 2022-06-14
category:
  - 运维
tag:
  - Linux
---

screen是一个模拟多屏的工具，可以在一个终端实现控制多个shell的功能。screen代表一个屏幕，同一个screen下可以再创建多个shell并自由切换。相比docker等容器繁琐的部署和管理，使用起来的比较直观敏捷。
<!-- more -->

# Ubuntu下使用screen

```bash
#安装screen
sudo apt-get install screen

# 创建会话并进入
screen -S [会话名]

# 创建但不进入
screen -dmS [会话名]

# 会话列表
screen -ls

# 回到会话（detached）
screen -r [会话名]

# 回到会话（attached）
screen -x [会话名]

# 修改会话名
screen -S [旧名字] -X sessionname [新名字]

# 删除会话
kill [会话ID]
# 不是会话名，是自动生成的数字前缀
```

在当前会话创建一个新shell窗口并切换到新窗口：

`Ctrl + A组合键，松开后按C`

在同一会话内的窗口之间切换：

`Ctrl + A W在终端底部显示当前所有窗口；0~9切换到对应窗口；空格向后循环切换窗口；P向前切换，N向后切换`

快捷键修改会话名：

`Ctrl + A :（冒号）`

删除当前窗口（shell）：

`Ctrl + A K`
注意删除后窗口的标记不变

脱离（Detach）当前会话：

`Ctrl + A D`
这样做会让会话变成`detached`状态。若使用`exit`离开则会话维持`attached`状态，两种情况需要使用不同的方法在终端恢复会话。

## Quote

https://blog.csdn.net/euzmin/article/details/105090217

https://blog.csdn.net/han0373/article/details/81352663/

https://www.xcwmoon.com/post/143