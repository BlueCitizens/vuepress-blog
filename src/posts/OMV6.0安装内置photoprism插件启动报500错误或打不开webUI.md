---
icon: pen-to-square
date: 2023-03-18
category:
  - NAS
tag:
  - OMV
  - 开源
---

# OMV6.0安装内置photoprism插件启动报500错误或打不开webUI

## 问题描述
在OMV6的插件中心安装集成的photoprism服务，启动报500 Internal Server Error，还有一大串日志，可能包含```Job for pod-photoprism.service failed because the control process exited with error code.```之类的，这种情况多半是因为集成的photoprism是基于podman（与docker类似的容器运行时）的，而podman中和k8s相关的模块使用默认源在大陆似乎是被屏蔽或污染的，因此需要修改配置文件改成国内的镜像源。你可以参考以下博客来操作：
[omv 系统初步设置 - photoprism 软件](https://blog.csdn.net/qq_39122387/article/details/128294831#t1)

我已经实践了该操作，可以肯定的是这样确实解决了无法加载相关模块导致的上述错误。

## 解决方案
至此，你可以再次尝试从OMV面板启动photoprism插件。如果一切正常，你也可以正常打开插件的webUI，那么恭喜你问题已经得到解决。

但如果你像我一样，虽然启动后没有报错，端口也可以telnet到，但就是打不开webUI，并且你之前已经在使用docker的话——

建议别折腾了（泪），老老实实用docker部署啥事没有。我在一些omv官方的forum中找到了一些相关的问题，有人提到docker和podman在网络配置上可能存在一定的冲突。这些冲突并不是不能解决，似乎修改一些子网配置就可以让它们正常运行，但我在这个问题上选择了逃避。也有人提到自己并没有遇到两者冲突的情况，所以它可能并不适合于所有人。如果你想要寻找相关解决方案，可以参考这个forum：
[Photoprism not accessible from local network](https://forum.openmediavault.org/index.php?thread/43102-photoprism-not-accessible-from-local-network/)

或者如果你能够确定是docker和podman的共存问题导致了无法使用，你可以更进一步将你的容器转移到podman管理——资料显示它是新一代的，旨在正面与docker对决的容器解决方案。我则选择了退后一步，继续使用docker并将photoprism部署在docker中。

## Quote
[omv 系统初步设置 - photoprism 软件](https://blog.csdn.net/qq_39122387/article/details/128294831#t1)

[Photoprism not accessible from local network](https://forum.openmediavault.org/index.php?thread/43102-photoprism-not-accessible-from-local-network/)

[I cannot run the OMV 6 PhotoPrism PlugIn.](https://forum.openmediavault.org/index.php?thread/42977-i-cannot-run-the-omv-6-photoprism-plugin/&l=2)

[500-Internal Server Error](https://forum.openmediavault.org/index.php?thread/42930-500-internal-server-error/)

[OMV6 安装photoprism报错，求支招](https://tieba.baidu.com/p/8007442336?red_tag=1272461822)