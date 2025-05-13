---
icon: pen-to-square
date: 2025-04-11
category:
  - 运维
tag:
  - SSH
  - CentOS
---

内部做安全漏洞审查，虚机被扫出来一堆漏洞，丢给乙方单位整改，先更新ssh结果炸了连不上了......
<!-- more -->

# OpenSSH升级（记录一次故障恢复）

## 系统环境

- CentOS 7.9
- OpenSSH 7.4p1
- OpenSSH 1.0.2k-fips

## 故障描述

更新的目标OpenSSH版本为9.9p1，通过源码编译方式安装。升级后SSH无法再次连接，使用命令行`ssh root@10.12.10.101`连接报错`No ED25519 host key is known for [hostname]`、`Host Key Verification Failed`。

## 故障排除

### 重装OpenSSH

你需要先下载源码并解压，然后进入到OpenSSH目录。

```shell
wget https://cdn.openbsd.org/pub/OpenBSD/OpenSSH/portable/openssh-9.9p1.tar.gz
tar -xzf openssh-9.9p1.tar.gz
cd openssh-9.9p1
```

在我的场景里，已经事先下载解压了，并且有MakeFile，所以我直接先`make uninstall`卸载掉原本的安装。此时我知道它被安装在了`/usr/local`下。

接下来配置生成新的MakeFile。某个版本后的OpenSSH不再必须依赖OpenSSL了，所以你也可以添加参数排除它，否则会提示OpenSSL版本需`>=1.1.1`。

```shell
./configure --prefix=/usr --sysconfdir=/etc/ssh --with-privsep-path=/var/lib/sshd --without-openssl
```

需要注意的是OpenSSH的config文件被配置在了`/etc/ssh`下，这是通常的位置，但也意味着旧版的配置文件也在这里。你需要考虑到新版和旧版配置的差异性，如果你没有做特别的配置，你可以直接弃用原来的配置文件并交给安装脚本自动生成新的。如果不是，你需要小心对照修改配置文件，通常在安装过程中也会自动检查这些配置。

```shell
# ssh_config sshd_config moduli
mv /etc/ssh/sshd_config /etc/ssh/sshd_config.old
mv /etc/ssh/ssh_config /etc/ssh/ssh_config.old
mv /etc/ssh/moduli /etc/ssh/moduli.old
# 安装
make && sudo make install
```

你可能会收到如下错误，请修改不正确的权限。

```shell
# Permissions 0640 for '/etc/ssh/ssh_host_ed25519_key' are too open.
# It is required that your private key files are NOT accessible by others.
# This private key will be ignored.
# Unable to load host key "/etc/ssh/ssh_host_ed25519_key": bad permissions
# Unable to load host key: /etc/ssh/ssh_host_ed25519_key
# sshd: no hostkeys available -- exiting.

# 修改权限
chmod -R 600 /etc/ssh
```

停掉旧的服务，并拷贝一份新的服务脚本。

```shell
systemctl stop sshd
systemctl disable sshd

cp -a contrib/redhat/sshd.init /etc/init.d/sshd
# 如提示覆盖
cp: overwrite `/etc/init.d/sshd'? y
chmod +x /etc/init.d/sshd
chkconfig --add /etc/init.d/sshd
systemctl enable sshd
systemctl restart sshd
# 确认服务active
systemctl status sshd
```

此时如果使用`root`登录会验证失败，需要在`/etc/ssh/sshd_config`中开放`PermitRootLogin`并配置为`yes`

```shell
vi /etc/ssh/sshd_config

# PermitRootLogin prohibit-password 禁止使用密码登录 需改为yes
PermitRootLogin yes
# 重启服务
systemctl restart sshd
```



# Quote

[CentOS7 Openssh7.4升级至9.9版本_centos7升级openssh9.9-CSDN博客](https://blog.csdn.net/2401_89626409/article/details/144405820)