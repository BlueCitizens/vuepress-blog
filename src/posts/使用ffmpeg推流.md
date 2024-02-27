---
icon: pen-to-square
date: 2021-03-09
category:
  - 开发
tag:
  - 流媒体
  - ffmpeg
---

# 使用ffmpeg推流

## 安装ffmpeg

```
sudo apt update
sudo apt install ffmpeg
```
要验证安装，请使用以下ffmpeg -version命令，该命令显示FFmpeg版本：

```
ffmpeg -version
```

输出应如下所示：

```
ffmpeg version 4.2.4-1ubuntu0.1 Copyright (c) 2000-2020 the FFmpeg developers
built with gcc 9 (Ubuntu 9.3.0-10ubuntu2)
```

要打印所有可用的FFmpeg的编码器和解码器，请输入：

ffmpeg -encoders
ffmpeg -decoders

[如何在Ubuntu 20.04上安装和使用FFmpeg](https://www.iplayio.cn/post/49156789)

## 推流

进入到媒体文件的目录下，或使用绝对路径，取文件名（包含扩展名）：

```
ffmpeg -re -i test.mp4 -c copy -f flv rtmp://172.17.162.184:1935/live/livestream
```