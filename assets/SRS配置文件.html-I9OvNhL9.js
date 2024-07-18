import{_ as e}from"./plugin-vue_export-helper-DlAUqK2U.js";import{o as n,c as i,d as s}from"./app-BAOdPLI2.js";const t={},l=s(`<h1 id="srs配置文件" tabindex="-1"><a class="header-anchor" href="#srs配置文件"><span>SRS配置文件</span></a></h1><p>打开srs的配置文件</p><p>vim srs/trunk/conf/srs.conf</p><p>原生默认的配置</p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code># main config for srs.
# @see full.conf for detail config.

listen              1935;
max_connections     1000;
srs_log_tank        file;
srs_log_file        ./objs/srs.log;
daemon              on;
http_api {
    enabled         on;
    listen          1985;
}
http_server {
    enabled         on;
    listen          8080;
    dir             ./objs/nginx/html;
}
stats {
    network         0;
    disk            sda sdb xvda xvdb;
}
vhost __defaultVhost__ {
    hls {
        enabled         on;
    }
    http_remux {
        enabled     on;
        mount       [vhost]/[app]/[stream].flv;
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>对以上配置文件解说，并增加一些目前缺省的常用配置</p><p><em>配置文件中用井号‘#’作为注释符，m3u8文件也类似</em></p><div class="language-text line-numbers-mode" data-ext="text" data-title="text"><pre class="language-text"><code>vhost __defaultVhost__ {
    hls {

        enabled         on; 
		#是否开启HLS（网上说是默认关闭的，我的是默认开启，若关闭有什么影响？）

		hls_fragment 	10;
		#切片ts文件时长 单位：秒（s）

		hls_window		60;
		#m3u8中保存多少个切片文件

		hls_cleanup	off;
		#自动清除ts文件开关
		
    }
    http_remux {
        enabled     on;
        mount       [vhost]/[app]/[stream].flv;
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,8),a=[l];function d(r,o){return n(),i("div",null,a)}const m=e(t,[["render",d],["__file","SRS配置文件.html.vue"]]),u=JSON.parse(`{"path":"/posts/SRS%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6.html","title":"SRS配置文件","lang":"zh-CN","frontmatter":{"icon":"pen-to-square","date":"2021-03-13T00:00:00.000Z","category":["开发"],"tag":["流媒体","SRS"],"description":"SRS配置文件 打开srs的配置文件 vim srs/trunk/conf/srs.conf 原生默认的配置 对以上配置文件解说，并增加一些目前缺省的常用配置 配置文件中用井号‘#’作为注释符，m3u8文件也类似","head":[["meta",{"property":"og:url","content":"https://mister-hope.github.io/posts/SRS%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6.html"}],["meta",{"property":"og:site_name","content":"BCkun's BLOG"}],["meta",{"property":"og:title","content":"SRS配置文件"}],["meta",{"property":"og:description","content":"SRS配置文件 打开srs的配置文件 vim srs/trunk/conf/srs.conf 原生默认的配置 对以上配置文件解说，并增加一些目前缺省的常用配置 配置文件中用井号‘#’作为注释符，m3u8文件也类似"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-02-27T02:44:22.000Z"}],["meta",{"property":"article:author","content":"BlueCitizen"}],["meta",{"property":"article:tag","content":"流媒体"}],["meta",{"property":"article:tag","content":"SRS"}],["meta",{"property":"article:published_time","content":"2021-03-13T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2024-02-27T02:44:22.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"SRS配置文件\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2021-03-13T00:00:00.000Z\\",\\"dateModified\\":\\"2024-02-27T02:44:22.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"BlueCitizen\\",\\"url\\":\\"https://bckun.top\\"}]}"]]},"headers":[],"git":{"createdTime":1709001862000,"updatedTime":1709001862000,"contributors":[{"name":"BlueCitizens","email":"bluecitizens@163.com","commits":1}]},"readingTime":{"minutes":0.72,"words":215},"filePathRelative":"posts/SRS配置文件.md","localizedDate":"2021年3月13日","excerpt":"\\n<p>打开srs的配置文件</p>\\n<p>vim srs/trunk/conf/srs.conf</p>\\n<p>原生默认的配置</p>\\n<div class=\\"language-text\\" data-ext=\\"text\\" data-title=\\"text\\"><pre class=\\"language-text\\"><code># main config for srs.\\n# @see full.conf for detail config.\\n\\nlisten              1935;\\nmax_connections     1000;\\nsrs_log_tank        file;\\nsrs_log_file        ./objs/srs.log;\\ndaemon              on;\\nhttp_api {\\n    enabled         on;\\n    listen          1985;\\n}\\nhttp_server {\\n    enabled         on;\\n    listen          8080;\\n    dir             ./objs/nginx/html;\\n}\\nstats {\\n    network         0;\\n    disk            sda sdb xvda xvdb;\\n}\\nvhost __defaultVhost__ {\\n    hls {\\n        enabled         on;\\n    }\\n    http_remux {\\n        enabled     on;\\n        mount       [vhost]/[app]/[stream].flv;\\n    }\\n}\\n</code></pre></div>","autoDesc":true}`);export{m as comp,u as data};
