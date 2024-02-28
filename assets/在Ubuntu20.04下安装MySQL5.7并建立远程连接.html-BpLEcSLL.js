import{_ as s}from"./plugin-vue_export-helper-DlAUqK2U.js";import{r as a,o as l,c as d,f as r,a as e,b as i,d as t,e as c}from"./app-B1G4RYfZ.js";const u={},o=e("p",null,"Ubuntu20.04的官方apt镜像源中已经不提供MySQL5.X了，目前至少都是8.0起步。更离谱的是腾讯云默认的镜像源中也没有5.7版本。这不禁让我面露难色：难道全世界除了我都已经过渡到新版本的MySQL了吗？",-1),v=c(`<h1 id="在ubuntu20-04下安装mysql5-7并建立远程连接" tabindex="-1"><a class="header-anchor" href="#在ubuntu20-04下安装mysql5-7并建立远程连接"><span>在Ubuntu20.04下安装MySQL5.7并建立远程连接</span></a></h1><h2 id="修改镜像源" tabindex="-1"><a class="header-anchor" href="#修改镜像源"><span>修改镜像源</span></a></h2><p>实测阿里镜像源可以正常安装。你也可以尝试其他镜像源，但不保证可用。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>#  阿里源
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="如何修改镜像源" tabindex="-1"><a class="header-anchor" href="#如何修改镜像源"><span>如何修改镜像源</span></a></h3><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># 将原来的source文件复制多一份加上.old，方便恢复
sudo cp /etc/apt/sources.list /etc/apt/sources.list.old

# 修改source文件的内容
sudo vim /etc/apt/sources.list
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>提示：在命令行模式下先按<code>gg</code>使光标跳转到第一行再按<code>dG</code>可以快速清空所有内容。</p><p>将上文的阿里源全部粘贴进去并保存。回到控制台，修改完source文件需要更新一下镜像源才能安装：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># 更新镜像源
sudo apt update

# 安装MySQL5.7，一共有三个包，最后一个选装
sudo apt install mysql-server-5.7 
sudo apt install mysql-client-5.7

# 使用c/c++等语言操作mysql的动态链接库时需要
sudo apt install libmysqlclient-dev
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>安装过程直接结束，中间似乎没有提示设置密码……可能Ubuntu server看不到吧，按理说我没有安装过也不应该有卸载残余。总之需要手动设置。</p><p>先确认一下是否安装好：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>mysql -V # 查看mysql版本
netstat -tap | grep mysql # 查看mysql服务
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>先去<code>/etc/mysql</code>下找<code>debian.cnf</code>文件，预览一下看看默认的账户密码是什么。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>sudo cat /etc/mysql/debian.cnf

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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>用这里的user和password登录MySQL。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>mysql -udebian-sys-maint -pABCDEFG
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>然后设置新密码。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># 切换到mysql库
use mysql;

# 设置密码
update user set authentication_string=PASSWORD(&quot;新密码&quot;) where user=&#39;root&#39;;

# 刷新
flush privileges;

# 退出mysql回到控制台
quit;

# 重启mysql数据库
sudo service mysql restart
 
# 使用新密码登陆mysql 
mysql -uroot -p123456
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="用navicat连接远程数据库" tabindex="-1"><a class="header-anchor" href="#用navicat连接远程数据库"><span>用Navicat连接远程数据库</span></a></h2><p>先登录MySQL，并切换到mysql库。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># 切换到mysql库
use mysql;

# 看查询结果中是否有host字段值为 %
select host from user where user = &#39;root&#39;;

+-----------+
| host      |
+-----------+
| %         |
| localhost |
+-----------+
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到root对应的host值有两个，一个是百分号%，这个就对应着远程登录；另一个是localhost，代表着本地登录。可能还会有其他的，与本文无关。</p><p>如果没有%，就无法正常连接。继续在mysql库运行如下语句：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>update user set host = &#39;%&#39; where user = &#39;root&#39;;

# 刷新权限
flush privileges
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>为其增加一个%即可，别忘了刷新。最后记得要在服务器的防火墙设置里开放3306端口。</p><h2 id="连接失败-报2003错误" tabindex="-1"><a class="header-anchor" href="#连接失败-报2003错误"><span>连接失败，报2003错误</span></a></h2><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>2003-cant connection to mysql server on ‘your ip’（10061 unknown error）
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>这个错有很多可能，我遇到的情况是本地回环地址配置有问题。在下面的配置文件里找一个叫做<code>[mysqld]</code>的段落。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># 如果这里面没有，就在它链接到的配置文件里找
cat -n /etc/mysql/my.cnf

# 这是我最终找到的配置文件
cat /etc/mysql/mysql.conf.d/mysqld.cnf 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>紧接着在<code>[mysqld]</code>下面找一个叫<code>bind-address</code>的字段。如果是127.0.0.1，那么将它直接注释掉。再次重启mysql服务，应该就能连接了。</p><h2 id="quote" tabindex="-1"><a class="header-anchor" href="#quote"><span>Quote</span></a></h2>`,31),m={href:"https://blog.csdn.net/u013519290/article/details/122012747",target:"_blank",rel:"noopener noreferrer"},b={href:"https://blog.csdn.net/m0_67390788/article/details/124090360",target:"_blank",rel:"noopener noreferrer"},p={href:"https://www.jb51.net/article/202399.htm",target:"_blank",rel:"noopener noreferrer"},h={href:"https://blog.csdn.net/alwaysbefine/article/details/116332945",target:"_blank",rel:"noopener noreferrer"};function y(g,x){const n=a("ExternalLinkIcon");return l(),d("div",null,[o,r(" more "),v,e("p",null,[e("a",m,[i("ubuntu 20.04安装mysql 5.7"),t(n)])]),e("p",null,[e("a",b,[i("Ubuntu16安装mysql5.7未提示输入密码，安装后修改mysql密码默认密码"),t(n)])]),e("p",null,[e("a",p,[i("Ubuntu 20.04 安装和配置MySql5.7的详细教程"),t(n)])]),e("p",null,[e("a",h,[i("MySQL远程连接报错2003-cant connection to mysql server on ‘IP’（10061 unknown error）"),t(n)])])])}const f=s(u,[["render",y],["__file","在Ubuntu20.04下安装MySQL5.7并建立远程连接.html.vue"]]),B=JSON.parse(`{"path":"/posts/%E5%9C%A8Ubuntu20.04%E4%B8%8B%E5%AE%89%E8%A3%85MySQL5.7%E5%B9%B6%E5%BB%BA%E7%AB%8B%E8%BF%9C%E7%A8%8B%E8%BF%9E%E6%8E%A5.html","title":"在Ubuntu20.04下安装MySQL5.7并建立远程连接","lang":"zh-CN","frontmatter":{"icon":"pen-to-square","date":"2022-08-24T00:00:00.000Z","category":["运维"],"tag":["Linux"],"description":"Ubuntu20.04的官方apt镜像源中已经不提供MySQL5.X了，目前至少都是8.0起步。更离谱的是腾讯云默认的镜像源中也没有5.7版本。这不禁让我面露难色：难道全世界除了我都已经过渡到新版本的MySQL了吗？ 在Ubuntu20.04下安装MySQL5.7并建立远程连接 修改镜像源 实测阿里镜像源可以正常安装。你也可以尝试其他镜像源，但不保证可...","head":[["meta",{"property":"og:url","content":"https://mister-hope.github.io/posts/%E5%9C%A8Ubuntu20.04%E4%B8%8B%E5%AE%89%E8%A3%85MySQL5.7%E5%B9%B6%E5%BB%BA%E7%AB%8B%E8%BF%9C%E7%A8%8B%E8%BF%9E%E6%8E%A5.html"}],["meta",{"property":"og:site_name","content":"BCkun's BLOG"}],["meta",{"property":"og:title","content":"在Ubuntu20.04下安装MySQL5.7并建立远程连接"}],["meta",{"property":"og:description","content":"Ubuntu20.04的官方apt镜像源中已经不提供MySQL5.X了，目前至少都是8.0起步。更离谱的是腾讯云默认的镜像源中也没有5.7版本。这不禁让我面露难色：难道全世界除了我都已经过渡到新版本的MySQL了吗？ 在Ubuntu20.04下安装MySQL5.7并建立远程连接 修改镜像源 实测阿里镜像源可以正常安装。你也可以尝试其他镜像源，但不保证可..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-02-27T02:44:22.000Z"}],["meta",{"property":"article:author","content":"BlueCitizen"}],["meta",{"property":"article:tag","content":"Linux"}],["meta",{"property":"article:published_time","content":"2022-08-24T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2024-02-27T02:44:22.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"在Ubuntu20.04下安装MySQL5.7并建立远程连接\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2022-08-24T00:00:00.000Z\\",\\"dateModified\\":\\"2024-02-27T02:44:22.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"BlueCitizen\\",\\"url\\":\\"https://bckun.top\\"}]}"]]},"headers":[{"level":2,"title":"修改镜像源","slug":"修改镜像源","link":"#修改镜像源","children":[{"level":3,"title":"如何修改镜像源","slug":"如何修改镜像源","link":"#如何修改镜像源","children":[]}]},{"level":2,"title":"用Navicat连接远程数据库","slug":"用navicat连接远程数据库","link":"#用navicat连接远程数据库","children":[]},{"level":2,"title":"连接失败，报2003错误","slug":"连接失败-报2003错误","link":"#连接失败-报2003错误","children":[]},{"level":2,"title":"Quote","slug":"quote","link":"#quote","children":[]}],"git":{"createdTime":1709001862000,"updatedTime":1709001862000,"contributors":[{"name":"BlueCitizens","email":"bluecitizens@163.com","commits":1}]},"readingTime":{"minutes":3.39,"words":1018},"filePathRelative":"posts/在Ubuntu20.04下安装MySQL5.7并建立远程连接.md","localizedDate":"2022年8月24日","excerpt":"<p>Ubuntu20.04的官方apt镜像源中已经不提供MySQL5.X了，目前至少都是8.0起步。更离谱的是腾讯云默认的镜像源中也没有5.7版本。这不禁让我面露难色：难道全世界除了我都已经过渡到新版本的MySQL了吗？</p>\\n","autoDesc":true}`);export{f as comp,B as data};
