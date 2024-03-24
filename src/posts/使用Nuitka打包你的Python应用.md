---
icon: pen-to-square
date: 2024-02-28
category:
  - 开发
tag:
  - Nuitka
  - Python
---

# 在Windows上使用Nuitka打包你的Python应用

## 环境

Windows11

MSYS2

Python 3.11.8

## 安装Nuitka

由于Nuitka需要gcc环境，需要在Windows上安装MSYS2。但使用MSYS2自带的Python创建虚拟环境安装Nuitka会遇到一些问题。具体的解释和安装过程参考我的另一篇文章：[安装Nuitka时遇到pip subprocess to install build dependencies did not run successfully](https://blog.bckun.top/posts/%E5%AE%89%E8%A3%85Nuitka%E6%97%B6%E9%81%87%E5%88%B0pip%20subprocess%20to%20install%20build%20dependencies.html)

按照如下步骤也可以正确安装Nuitka

在`MSYS2 MINGW64`下通过命令安装

```bash
pacman -S mingw-w64-x86_64-python-nuitka
```

创建虚拟环境时带上系统软件包

```bash
python -m venv venv --system-site-packages
```

进入虚拟环境，可以看到Nuitka包已经存在了

```bash
pip list

Package     Version
----------- -------
Nuitka      2.0.2
ordered-set 4.1.0
pip         24.0
setuptools  65.5.0
zstandard   0.22.0
```

## 使用命令打包

```sh
python -m nuitka --standalone --mingw64 src/flask/app.py --enable-plugin=tk-inter
 --onefile --windows-icon-from-ico=resources/bili.ico
```

