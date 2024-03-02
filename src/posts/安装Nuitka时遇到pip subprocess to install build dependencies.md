---
icon: pen-to-square
date: 2024-02-28
category:
  - 开发
tag:
  - Nuitka
  - Python
---

# 安装Nuitka时遇到pip subprocess to install build dependencies did not run successfully

## 背景

使用MSYS2自带的`Python3.11.8`创建的虚拟环境下安装Nuitka会报如下错误

```bash
  Installing build dependencies ... error
  error: subprocess-exited-with-error

  × pip subprocess to install build dependencies did not run successfully.
  │ exit code: 1
  ╰─> [51 lines of output]
      Looking in indexes: https://pypi.tuna.tsinghua.edu.cn/simple
      Collecting cffi==1.16.0
        Using cached https://pypi.tuna.tsinghua.edu.cn/packages/68/ce/95b0bae7968c65473e1298efb042e10cafc7bafc14d9e4f154008241c91d/cffi-1.16.0.tar.gz (512 kB)
        Installing build dependencies: started
        Installing build dependencies: finished with status 'done'
        Getting requirements to build wheel: started
        Getting requirements to build wheel: finished with status 'error'
        error: subprocess-exited-with-error

        Getting requirements to build wheel did not run successfully.
        exit code: 1

        [27 lines of output]
        Traceback (most recent call last):
        
          ......
          
          File "C:\Users\BlueCitizen\AppData\Local\Temp\pip-build-env-r75amcq2\overlay\lib\python3.11\site-packages\setuptools\_distutils\_msvccompiler.py", line 246, in initialize
            raise DistutilsPlatformError(
        distutils.errors.DistutilsPlatformError: --plat-name must be one of ('win32', 'win-amd64', 'win-arm32', 'win-arm64')
        [end of output]

        note: This error originates from a subprocess, and is likely not a problem with pip.
      error: subprocess-exited-with-error

      Getting requirements to build wheel did not run successfully.
      exit code: 1

      See above for output.

      note: This error originates from a subprocess, and is likely not a problem with pip.
      [end of output]

  note: This error originates from a subprocess, and is likely not a problem with pip.
error: subprocess-exited-with-error

× pip subprocess to install build dependencies did not run successfully.
│ exit code: 1
╰─> See above for output.

note: This error originates from a subprocess, and is likely not a problem with pip.
```

使用`gcc -v`打印编译环境也是正常的，猜测和MSYS2或者虚拟环境有关。

## 解决方案

经过一番搜索发现使用MSYS2自带的Python安装Nuitka确实可能会出现各种奇奇怪怪的错误。幸运的是，Nuitka官方放出了专用的软件包。Package: [mingw-w64-x86_64-python-nuitka](https://packages.msys2.org/package/mingw-w64-x86_64-python-nuitka?repo=mingw64)

在`MSYS2 MINGW64`下通过命令安装

```bash
pacman -S mingw-w64-x86_64-python-nuitka
```

就可以在MSYS2环境下安装Nuitka了。

接下来，在创建虚拟环境时需要带上已经安装的系统软件包，否则虚拟环境中依然没有Nuitka。

```bash
python -m venv venv --system-site-packages
```

此时再进入虚拟环境，`pip list`查看已安装的软件包，会发现已经有Nuitka了。

```bash
Package     Version
----------- -------
Nuitka      2.0.2
ordered-set 4.1.0
pip         24.0
setuptools  65.5.0
zstandard   0.22.0
```

接下来按照正常的流程打包即可。

```bash
python -m nuitka --standalone --mingw64 app.py
```

## Quote

[error: --plat-name must be one of (‘win32‘, ‘win-amd64‘, ‘win-arm32‘, ‘win-arm64‘)](https://blog.csdn.net/jaket5219999/article/details/131520276)

[mingw-w64-x86_64-python-nuitka](https://packages.msys2.org/package/mingw-w64-x86_64-python-nuitka?repo=mingw64)