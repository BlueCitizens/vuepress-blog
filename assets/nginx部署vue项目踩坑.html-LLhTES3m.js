import{_ as d}from"./plugin-vue_export-helper-DlAUqK2U.js";import{r as s,o as l,c as r,b as e,e as n,a as t,d as a}from"./app-DWrczI2p.js";const o={},c=a(`<h1 id="nginx部署vue项目踩坑" tabindex="-1"><a class="header-anchor" href="#nginx部署vue项目踩坑"><span>nginx部署vue项目踩坑</span></a></h1><h2 id="安装nginx" tabindex="-1"><a class="header-anchor" href="#安装nginx"><span>安装nginx</span></a></h2><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>sudo apt install nginx

nginx -v
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="打包vue项目" tabindex="-1"><a class="header-anchor" href="#打包vue项目"><span>打包vue项目</span></a></h2><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>npm run build
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>会在在项目路径下生成dist文件夹。里面包含入口index.html、一些静态资源和构建后的脚本/样式文件。</p><p>将整个文件夹（包括dist）复制到磁盘的某个位置。可以使用nginx默认的位置<code>/var/www/</code>，也可以在home目录下。总之找一个方便自己的位置。</p><h2 id="配置站点" tabindex="-1"><a class="header-anchor" href="#配置站点"><span>配置站点</span></a></h2><p>首先明确一下我们的目标是将打包好的项目配置到nginx中运行并能够通过某个端口访问。一般一个server模块配置一个站点。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>http {
# 其他的配置
......

server {......}

server {......}

# 其他的配置
......
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>通常你可以在/etc/nginx下找到所有需要的配置文件。但这里有一些问题需要事先说明，否则可能会浪费很多时间踩坑。</p>`,11),u={href:"https://wiki.debian.org/Nginx/DirectoryStructure",target:"_blank",rel:"noopener noreferrer"},v=a('<table><thead><tr><th>Path</th><th>Purpose</th></tr></thead><tbody><tr><td>./conf.d/*.conf</td><td>Extra configuration files.</td></tr><tr><td>./fastcgi.conf</td><td>Commonly configured directives (nginx packaging team)</td></tr><tr><td>./fastcgi_params</td><td>Commonly configured directives (upstream version)</td></tr><tr><td>./koi-utf</td><td>Nginx Character Set</td></tr><tr><td>./koi-win</td><td>Nginx Character Set</td></tr><tr><td>./mime.types</td><td>Maps file name extensions to MIME types of responses</td></tr><tr><td>./nginx.conf</td><td>The primary configuration file.</td></tr><tr><td>./proxy_params</td><td>Commonly configured directives</td></tr><tr><td>./scgi_params</td><td>Commonly configured directives</td></tr><tr><td>./sites-available/*</td><td>Extra virtual host configuration files</td></tr><tr><td>./sites-enabled/*</td><td>Symlink to sites-available/&lt;file&gt; to enable vhost</td></tr><tr><td>./snippets/*.conf</td><td>Configuration snippets that can be included in configs</td></tr><tr><td>./apps.d/*.conf</td><td>Files included by /etc/nginx/sites-available/default</td></tr><tr><td>./uwsgi_params</td><td>Commonly configured directives</td></tr><tr><td>./win-utf</td><td>Nginx Character Set</td></tr></tbody></table><p>这里比较重要的我使用了加粗，分别会在下文中提到。</p><h2 id="nginx-conf是什么" tabindex="-1"><a class="header-anchor" href="#nginx-conf是什么"><span>nginx.conf是什么</span></a></h2><p>在nginx服务启动时，会自动加载配置文件/etc/nginx/nginx.conf。许多文章会建议你直接在该文件中添加项目或者清空该文件的内容并粘贴他们配置好的项目，这样做其实没有问题。</p>',4),p={href:"https://wiki.debian.org/Nginx/DirectoryStructure",target:"_blank",rel:"noopener noreferrer"},m=a(`<p>The first file that nginx reads when it starts is <code>/etc/nginx/nginx.conf</code>. This file is maintained by Nginx package maintainers and it is recommended that administrators avoid editing this file unless they also follow changes made by upstream.</p><p>It&#39;s advised to instead add customizations underneath of the conf.d/ directory which is described below.</p><p>大概是说不推荐修改nginx.conf，而应该去conf.d下增加自定义的配置文件，因为该文件是由nginx团队维护的，例如在更新时会覆盖掉该文件。</p><p>实际上，nginx推荐用户创建模块化的配置文件。观察nginx.conf的原始内容就会发现，在http{}的最后有这样几行：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>##
# Virtual Host Configs
##

include /etc/nginx/conf.d/*.conf;
include /etc/nginx/sites-enabled/*;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这两行的意思是nginx.conf分别引入了路径<code>/etc/nginx/conf.d/</code>下的所有*.conf文件和路径<code>/etc/nginx/sites-enabled/</code>下的所有文件。引入文件相当于将目标文件的内容拼接到引入的位置。</p><p>另外要注意的就是这两行引入的位置。通常在配置文件中，后配置的项目会覆盖前面的。因此假如你想要在nginx.conf中完成所有配置，你需要格外注意是否会被这两个引入的配置覆盖，比如你可能需要将这两行注释掉来让你自己的配置生效。</p><h2 id="sites-available-和-sites-enabled" tabindex="-1"><a class="header-anchor" href="#sites-available-和-sites-enabled"><span>sites-available 和 sites-enabled</span></a></h2><p>在nginx.conf同级目录下有这两个文件夹。它们分别在路径下包含一个文件default。</p><p>前文已经提到，主配置文件nginx.conf中引入了sites-enabled下的配置文件，我们就从这个文件夹说起。</p><p>进入目录，默认里面只有一个default文件。浏览一下里面的内容，头部注释了一些很重要的文字：</p><p>In most cases, administrators will remove this file from sites-enabled/ and leave it as reference inside of sites-available where it will continue to be updated by the nginx packaging team.</p><p>什么叫做“通常情况下，管理员会删除sites-enabled下的此文件（default）”呢？用命令看一下这个文件究竟是何方神圣：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>#列出文件信息
ls -l

# 控制台输出
total 0
lrwxrwxrwx 1 root root 34 May 21  2021 default -&gt; /etc/nginx/sites-available/default
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到default文件有一个箭头指向sites-available下的default文件，这说明sites-enabled下的default文件是通过软链接（symbolic link）从sites-available下链接过来的。关于链接是什么请查阅其他资料。简单来说就是在不占用磁盘空间的情况下在文件系统的不同位置创建一个或多个副本，并最终指向同一个物理位置，类似于指针，对其中任何一个编辑都会引起该文件被编辑。</p><p>删除一个链接的方法也很简单，就是把链接文件删除。所以这里说“删除sites-enabled下的default文件”，即删除这个软链接。这样做的结果就是<code>/etc/nginx/sites-available/default</code>里的配置不会被引入nginx.conf，也就不会生效了。</p><p>另外和nginx.conf文件一样，这个default文件也是由nginx团队维护的。区别在于这个文件并不应当直接参与配置，而是作为配置的参考文件存在，即定义了一种写配置的规范。</p><p>因此，很多人虽然没有在nginx.conf中直接配置，但是直接写在了这个default文件里，这也是不规范的。</p><p>那么正确的配置方法是什么呢？</p><p>现在再来看一下sites-available和sites-enabled的含义是什么。sites-enabled代表正在生效的配置，sites-available代表备选的配置。再配合软链接就很好理解了，配置一个站点的思路如下：</p><ol><li>在sites-available中新建一个任意文件名的文件（当然，不能再用default）</li><li>编辑文件添加配置</li><li>将其软链接到sites-enabled下</li></ol><p>这样做的好处就是可以实现按需链接，增加和删除配置都很方便，比如当我们需要停用某个站点时删除软链接即可，而需要恢复时只需要重新添加软链接，不需要在配置文件中修改。</p><h2 id="示例" tabindex="-1"><a class="header-anchor" href="#示例"><span>示例</span></a></h2><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>cd /etc/nginx/sites-available/

# 新建一个文件
sudo touch test

sudo vim test

# 将下面的配置完整粘贴到test中并保存
server {
    listen       80;
    server_name  localhost;
 
    location / {
        # dist文件夹路径
        root   /var/www/test/dist;
        try_files $uri $uri/ /index.html;
        index  index.html index.htm;
    }
 
    location /prod-api/{
            proxy_set_header Host $http_host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header REMOTE-HOST $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

            # 后台端口
            proxy_pass http://localhost:8080/;
    }
 
 
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
            root html;
    }
 
}

# 建立软链接
sudo ln -s /etc/nginx/sites-available/test /etc/nginx/sites-enabled/

# 检查配置文件的语法
sudo nginx -t 

# 重启nginx使配置生效
sudo nginx -s reload

# 如果没有生效就先停止nginx再启动
sudo nginx -s stop
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="重启报错-error-open-run-nginx-pid-failed-2-no-such-file-or-directory" tabindex="-1"><a class="header-anchor" href="#重启报错-error-open-run-nginx-pid-failed-2-no-such-file-or-directory"><span>重启报错 [error] open() &quot;/run/nginx.pid&quot; failed (2: No such file or directory)</span></a></h2><p>如果你出于某种原因使用kill等命令强制停止了nginx，就会一同删除pid文件。因此再次启动时nginx会找不到pid文件。这时候需要执行命令挂载配置文件，这样在启动时如果发现没有pid文件就会根据nginx.conf创建pid文件。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>sudo nginx -c /etc/nginx/nginx.conf
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="访问项目浏览器报-500-internal-server-error" tabindex="-1"><a class="header-anchor" href="#访问项目浏览器报-500-internal-server-error"><span>访问项目浏览器报 500 Internal Server Error</span></a></h2><p>看一下报错日志：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># 查看nginx日志
tail /var/log/nginx/error.log

2022/08/27 11:14:43 [crit] 1146840#1146840: *26068 stat() &quot;/home/ubuntu/app/dist/index.html&quot; failed (13: Permission denied), client: 192.168.123.52, server: localhost, request: &quot;GET / HTTP/1.1&quot;, host: &quot;localhost&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>说明是nginx没有权限导致的。</p><p>看一下nginx.conf的开头几行，通常在第一行：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>user www-data;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>user是www-data，这是nginx默认的用户组，但是它拥有的权限很低。此时有两种解决方案：</p><ol><li>修改user为root，提高nginx权限（不推荐）</li><li>给予默认用户组权限</li></ol><p>不推荐的理由依然是所有配置都不应该在修改nginx.conf的前提下完成。另外，黑客可能通过用户组上传并执行恶意程序，因此尽量避免给予过分的权限。</p><p>如果你将dist放在了某个个人用户的目录中，那么可能是该目录没有开放对其他用户的权限。</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>sudo chmod 777 用户目录
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>一般来说放在用户目录意外的位置不会出现这个问题。如果有疑问可以到dist文件夹看一下读写权限：</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>ls -al

total 40
drwxr-xr-x 3 ubuntu ubuntu  4096 Aug 24 00:07 .
drwxr-xr-x 3 ubuntu ubuntu  4096 Aug 24 00:07 ..
-rw-r--r-- 1 ubuntu ubuntu 16958 Aug 23 23:27 favicon.ico
-rw-r--r-- 1 ubuntu ubuntu  6408 Aug 23 23:27 index.html
drwxr-xr-x 6 ubuntu ubuntu  4096 Aug 24 00:07 static
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到最左边一列的倒数第三个字符均为r，即该文件夹对其他所有者是开放了读权限的，这种情况下就已经可以正常访问网站了。</p><h2 id="quote" tabindex="-1"><a class="header-anchor" href="#quote"><span>Quote</span></a></h2>`,42),x={href:"https://blog.csdn.net/weixin_42856871/article/details/124171350",target:"_blank",rel:"noopener noreferrer"},g={href:"https://blog.csdn.net/hanziyuan08/article/details/104031959",target:"_blank",rel:"noopener noreferrer"},b={href:"https://linux265.com/course/linux-command-ln.html",target:"_blank",rel:"noopener noreferrer"},h={href:"https://www.jianshu.com/p/42c4ffd044e6",target:"_blank",rel:"noopener noreferrer"};function f(_,y){const i=s("ExternalLinkIcon");return l(),r("div",null,[c,e("p",null,[e("a",u,[n("官方Wiki"),t(i)]),n("中列出了/etc/nginx下包含的子文件：")]),v,e("p",null,[n("但是在"),e("a",p,[n("官方Wiki"),t(i)]),n("里有这样一段话:")]),m,e("p",null,[e("a",x,[n("Nginx failed (13 Permission denied)"),t(i)])]),e("p",null,[e("a",g,[n("对 ubuntu nginx 默认目录 sites_availables 和 sites_enabled 的理解"),t(i)])]),e("p",null,[e("a",b,[n("ln命令"),t(i)])]),e("p",null,[e("a",h,[n("Nginx 的 sites-available 和 sites-enabled 的区别"),t(i)])])])}const E=d(o,[["render",f],["__file","nginx部署vue项目踩坑.html.vue"]]),B=JSON.parse(`{"path":"/posts/nginx%E9%83%A8%E7%BD%B2vue%E9%A1%B9%E7%9B%AE%E8%B8%A9%E5%9D%91.html","title":"nginx部署vue项目踩坑","lang":"zh-CN","frontmatter":{"icon":"pen-to-square","date":"2022-08-25T00:00:00.000Z","category":["运维"],"tag":["Linux","Vue"],"description":"nginx部署vue项目踩坑 安装nginx 打包vue项目 会在在项目路径下生成dist文件夹。里面包含入口index.html、一些静态资源和构建后的脚本/样式文件。 将整个文件夹（包括dist）复制到磁盘的某个位置。可以使用nginx默认的位置/var/www/，也可以在home目录下。总之找一个方便自己的位置。 配置站点 首先明确一下我们的目标...","head":[["meta",{"property":"og:url","content":"https://mister-hope.github.io/posts/nginx%E9%83%A8%E7%BD%B2vue%E9%A1%B9%E7%9B%AE%E8%B8%A9%E5%9D%91.html"}],["meta",{"property":"og:site_name","content":"BCkun's BLOG"}],["meta",{"property":"og:title","content":"nginx部署vue项目踩坑"}],["meta",{"property":"og:description","content":"nginx部署vue项目踩坑 安装nginx 打包vue项目 会在在项目路径下生成dist文件夹。里面包含入口index.html、一些静态资源和构建后的脚本/样式文件。 将整个文件夹（包括dist）复制到磁盘的某个位置。可以使用nginx默认的位置/var/www/，也可以在home目录下。总之找一个方便自己的位置。 配置站点 首先明确一下我们的目标..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-02-27T02:44:22.000Z"}],["meta",{"property":"article:author","content":"BlueCitizen"}],["meta",{"property":"article:tag","content":"Linux"}],["meta",{"property":"article:tag","content":"Vue"}],["meta",{"property":"article:published_time","content":"2022-08-25T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2024-02-27T02:44:22.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"nginx部署vue项目踩坑\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2022-08-25T00:00:00.000Z\\",\\"dateModified\\":\\"2024-02-27T02:44:22.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"BlueCitizen\\",\\"url\\":\\"https://bckun.top\\"}]}"]]},"headers":[{"level":2,"title":"安装nginx","slug":"安装nginx","link":"#安装nginx","children":[]},{"level":2,"title":"打包vue项目","slug":"打包vue项目","link":"#打包vue项目","children":[]},{"level":2,"title":"配置站点","slug":"配置站点","link":"#配置站点","children":[]},{"level":2,"title":"nginx.conf是什么","slug":"nginx-conf是什么","link":"#nginx-conf是什么","children":[]},{"level":2,"title":"sites-available 和 sites-enabled","slug":"sites-available-和-sites-enabled","link":"#sites-available-和-sites-enabled","children":[]},{"level":2,"title":"示例","slug":"示例","link":"#示例","children":[]},{"level":2,"title":"重启报错 [error] open() \\"/run/nginx.pid\\" failed (2: No such file or directory)","slug":"重启报错-error-open-run-nginx-pid-failed-2-no-such-file-or-directory","link":"#重启报错-error-open-run-nginx-pid-failed-2-no-such-file-or-directory","children":[]},{"level":2,"title":"访问项目浏览器报 500 Internal Server Error","slug":"访问项目浏览器报-500-internal-server-error","link":"#访问项目浏览器报-500-internal-server-error","children":[]},{"level":2,"title":"Quote","slug":"quote","link":"#quote","children":[]}],"git":{"createdTime":1709001862000,"updatedTime":1709001862000,"contributors":[{"name":"BlueCitizens","email":"bluecitizens@163.com","commits":1}]},"readingTime":{"minutes":7.27,"words":2182},"filePathRelative":"posts/nginx部署vue项目踩坑.md","localizedDate":"2022年8月25日","excerpt":"\\n<h2>安装nginx</h2>\\n<div class=\\"language-text\\" data-ext=\\"text\\" data-title=\\"text\\"><pre class=\\"language-text\\"><code>sudo apt install nginx\\n\\nnginx -v\\n</code></pre></div><h2>打包vue项目</h2>\\n<div class=\\"language-text\\" data-ext=\\"text\\" data-title=\\"text\\"><pre class=\\"language-text\\"><code>npm run build\\n</code></pre></div>","autoDesc":true}`);export{E as comp,B as data};
