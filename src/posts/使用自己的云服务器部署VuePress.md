---
icon: pen-to-square
date: 2024-02-27
category:
  - 运维
tag:
  - Jenkins
  - GitHub

star: true
---

VuePress的官方文档里没有提供任何关于自定义部署的说明，而是推荐了若干自动化平台，里面还没有一个开源的。可能是默认大家都是花钱解决问题吧。
<!-- more -->

# 使用自己的云服务器部署VuePress

## 需求分析

首先代理静态页面最合适的容器肯定还是nginx。问题是，如果这是一个纯静态页面尚可，但作为一个博客，必须要能轻松将新文章展示到页面上。如果不借助其他手段，只能每次更新都要重新构建和发布，那就太麻烦了，违背了我从原本自建的博客系统转移到静态博客的初衷。由此可见VP官方文档推荐用自动化平台部署确实是有原因的。在众多方案中，唯一可以免费使用的就是利用GitHub或者GitLab这样的代码托管平台自带的自动化功能。但速度和稳定性并不理想，尤其是GitHub天然就有访问门槛。

## 方案选择

既然都是用自动化平台部署，那就自己动手搭建一个自动化平台。整个流程是将项目托管到GitHub，然后当我们将更新push到远程仓库时，利用GitHub hooks触发自动化平台拉取新代码和构建，最后用nginx代理构建的页面就可以实现了。


## 安装Jenkins

Jenkins应该是最有名的开源CI平台了，它使用Java编写，历史悠久，许多中小企业都使用它来搭建DevOps工作流。我们按照[官网的教学](https://www.jenkins.io/doc/book/installing/)安装Jenkins，以Debian/Ubuntu为例：

- 确保你的环境中有Java，JDK或者JRE都行。需要注意的是Jenkins即将停止对Java11的支持，安装17是更长久的选择。**此外，Java8的支持早已停止，只能使用较老的版本，许多插件和功能无法使用，不推荐**

```bash
sudo apt update
sudo apt install fontconfig openjdk-17-jre
java -version
openjdk version "17.0.8" 2023-07-18
OpenJDK Runtime Environment (build 17.0.8+7-Debian-1deb12u1)
OpenJDK 64-Bit Server VM (build 17.0.8+7-Debian-1deb12u1, mixed mode, sharing)
```

- 默认的apt仓库不包含Jenkins源，需要手动添加，以下是LTS版的添加方法，另外还有weekly版可供选择

``````bash
sudo wget -O /usr/share/keyrings/jenkins-keyring.asc \
  https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key
echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
  https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null
sudo apt update
sudo apt install jenkins
``````

### 为什么不使用Docker部署？

原因是我被中文官网坑了。简中的文档似乎已经很久没有维护了，推荐的Docker仓库是[jenkinsci/blueocean](https://hub.docker.com/r/jenkinsci/blueocean)，这个仓库最后一次更新是一年之前了。你应该使用的是英文官网提供的仓库[jenkins/jenkins](https://hub.docker.com/r/jenkins/jenkins)，这里才是最新版本。

此外，即便使用Docker部署，我仍然推荐将挂载的卷映射到真实路径而非使用容器路径，这会使后续操作变得简单。

## 部署Jenkins

理论上安装成功后Jenkins服务就已经启动了，访问服务器的8080端口，注意配置防火墙。此时需要用初始密码解锁Jenkins，密码在日志或者页面提示的路径下都可以找到。然后就是进行一些简单的初始化配置，包括创建管理员账户和自动安装一些插件。通常情况下全部完成后就可以使用了。

因为构建Vue应用需要NodeJS环境，所以我们需要先在Jenkins安装插件。进入`系统管理 > 插件管理 > 可用插件`，搜索NodeJS，选中并安装NodeJS Plugin，重启Jenkins，回到已安装的插件列表我们就能看到插件已经成功启用了

![NodeJS Plugin](https://img.bckun.top/file/8136ef7f8598ed2ee0bea.png)

### 配置NodeJS环境

接下来就可以配置Node环境了，进入到`系统管理 > 全局工具配置`，向下滚动到NodeJS安装，然后选择你需要的NodeJS版本（可以选和你本地的构建相同的），记得保存配置。详细步骤参考[jenkins 中配置Node环境](https://juejin.cn/post/7255588784590438456)

![config](https://img.bckun.top/file/d783842c1ee0698dda45a.png)

### 配置GitHub仓库

可以完整参考这篇[使用jenkins自动构建github项目](https://segmentfault.com/a/1190000023072976)

首先点击头像，依此进入到`Settings / Developer Settings / Personal access tokens / Tokens (classic)`，下拉`Generate new token > Generate new token (classic)`或者[直接戳链接直达](https://github.com/settings/tokens/new)，Note随便填，Expiration可以选择过期时间，也可以选永不过期，然后勾选`repo` `admin:public_key` `admin:repo_hook`，点最后的Generate token生成。此时会给你一个仅显示一次的key，这是使用这条token的唯一凭证，将它保存好。

![](https://img.bckun.top/file/4a00ca770cedcd4e0366e.png)

接下来在你的GitHub账户下新建一个仓库，进入仓库的`Settings > Webhook`，点击`Add webhook`，`Payload URL`填`Jenkins的地址/github-webhook/`，例如`http://xx.xxx.xxx.xxx:8080/github-webhook/`，触发规则选中`Just the push event`，勾选Active。添加成功后，仓库的变动将会推送到Jenkins的构建触发器。

![](https://img.bckun.top/file/5de15cfae11610839ce23.png)

### 配置Jenkins的GitHub插件

仿照NodeJS插件的安装方法安装GitHub插件（通常已经预装了该插件）。进入到Jenkins的`系统管理 > 系统配置`，滚动到GitHub，添加GitHub服务器如图，`API URL`填`https://api.github.com`，注意需要添加凭据Credentials，Secret填刚刚在GitHub获取到的token，ID和描述可以随意填写，填完可以点击连接测试测试一下是否连通。

![](https://img.bckun.top/file/cd9a8882a53cfdbba90af.png)

![](https://img.bckun.top/file/f693e7ed319d6042e55da.png)

## 创建任务

全局配置完成，接下来就是添加构建任务。点击`新建任务 > 构建一个自由风格的软件项目`，然后完成一下项目配置

- `General > GitHub项目 > 项目URL`填写仓库地址，如`https://github.com/BlueCitizens/vuepress-blog/`

  ![](https://img.bckun.top/file/de3743dc9a1365f9e4902.png)

- 源码管理 > Git

  注意这里也需要添加凭据Credentials，使用账户密码，用来从仓库拉取代码。源码库使用`githubweb`。

  ![](https://img.bckun.top/file/ecf47258eaebbc9216bd9.png)

  ![](https://img.bckun.top/file/7db31b28caf5cdff22910.png)

- 构建触发器

  勾选`GitHub hook trigger for GITScm polling`，其他不需要勾选。

- 构建环境

  勾选`Use secret text(s) or file(s)`和`Provide Node & npm bin/ folder to PATH`

  ![](https://img.bckun.top/file/35ef9894c42e8c6240ccf.png)

- Build Steps

  ![](https://img.bckun.top/file/4484a8562baeb11ee7951.png)

  ```bash
  echo $WORKSPACE
  node -v
  npm -v
  npm install&&
  npm run docs:build
  sudo rsync -a src/.vuepress/dist/ /var/www/vp-blog/dist/ --delete
  ```

  

  需要注意的是，你的构建指令可能与我不同。`rsync -a`命令用来将构建同步到你准备用nginx代理的路径，这样每次构建后nginx都能代理最新的构建。

  另外，Jenkins默认使用的用户组是`Jenkins:Jenkins`，这个用户只拥有在Jenkins工作目录下的权限，因此同步的命令需要使用`sudo`。通常解决这个问题有两个方向，一个是修改Jenkins使用的用户组，另一个是允许Jenkins绕过密码使用`sudo`，可以参考这两篇文章

  [如何修改sudoers？](https://segmentfault.com/q/1010000009005438)

  [前端工程化：保姆级教学 Jenkins 部署前端项目](https://juejin.cn/post/7102360505313918983#heading-8)

- 构建后操作

  ![](https://img.bckun.top/file/89fd73abb6daa3e2cd690.png)

保存以上配置，将你的本地代码push到远程仓库，然后你就可以尝试立即进行一次构建了。



## 使用nginx代理

安装nginx

```bash
sudo apt update
sudo apt install nginx
```

访问服务器的80端口，应该能看到`Welcome to nginx`，注意打开防火墙。

修改代理配置，并重载nginx。具体的代理配置方法可以参考我的博客

```
server {
	listen 80 default_server;
	listen [::]:80 default_server;

	root /var/www/vp-blog/dist;
	
	index index.html index.htm index.nginx-debian.html;

	server_name _;

	location / {
		# First attempt to serve request as file, then
		# as directory, then fall back to displaying a 404.
		try_files $uri $uri/ =404;
	}
}

```



```bash
sudo nginx -t
sudo nginx -s reload
```

到这里，你的博客就部署成功了。

## Quote

[Jenkins User Documentation](https://www.jenkins.io/doc/)

[jenkins 中配置Node环境](https://juejin.cn/post/7255588784590438456)

[使用jenkins自动构建github项目](https://segmentfault.com/a/1190000023072976)

[前端工程化：保姆级教学 Jenkins 部署前端项目](https://juejin.cn/post/7102360505313918983#heading-8)

[rsync 用法教程](https://www.ruanyifeng.com/blog/2020/08/rsync.html)