---
icon: pen-to-square
date: 2024-03-03
category:
  - 项目
tag:
  - Python

star: true
sticky: true
---

# 将你用手机缓存的B站视频转换为mp4和ass弹幕


## 需求

之前帮群友解决一个需求，某个Vtuber毕业了（其实我也有推），传的录播和视频都在一点一点删，好消息是他的手机里有缓存下来，坏消息是他不知道怎么把视频导出来，于是有了这个项目。

## 使用

我打包了两个版本，一个是用Electron构建的界面，一个是普通的终端界面，核心代码是完全一样的，区别只在界面的美观程度。Electron打包出来比较大，而且需要运行安装程序；便携版修复和更新可能会晚于GUI版（以GitHub release 为准）。

### 下载

两个版本都发布在[Github release](https://github.com/BlueCitizens/bilibili-app-cache-converter/releases)里了，或者你也可以通过网盘下载：

[123盘](https://www.123pan.com/s/a4ncjv-x6fph.html) 提取码: vt1C

注意下载大文件可能需要开通会员，尽可能通过GitHub下载

~~[蓝奏云](https://www.lanzoub.com/b05f2sduj) 密码: fiav~~

蓝奏云限制上传超过100M的文件和分卷文件，视情况上传


### 安装

GUI版本：安装使用

Portable版本：解压即用

## 更新日志

### 2024.03.26

现在可以支持PC客户端缓存的视频了 [v1.1.0-fc.1](https://github.com/BlueCitizens/bilibili-app-cache-converter/releases/tag/v1.1.0-fc.1)

### 2024.03.16

现在可以在遇到无法转换的文件时自动跳过并回显有问题的文件夹了 [v1.0.0-beta.2](https://github.com/BlueCitizens/bilibili-app-cache-converter/releases/tag/v1.0.0-beta.2)

修复了当缓存只有视频或音频时无限加载的问题 [v1.0.0-beta.1](https://github.com/BlueCitizens/bilibili-app-cache-converter/releases/tag/v1.0.0-beta.1)