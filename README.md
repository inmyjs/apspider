# apspider

> 这是以前给新媒体运营同事写的爬虫软件，用了一段时间就没用了（唉、气死我了）。

> 目前只抓取了新榜的日榜（周榜、月榜类似，换下地址即可）下，各行业的前50个公众号下的7天热门文章和最新发布文章

如下所示：
![](https://raw.githubusercontent.com/wiki/inmyjs/apspider/images/1.png)

### 技术架构：
1. nw.js
2. jquery
3. element-ui

为什么选用nw.js呢？嗯，先入为主吧，electron也很不错（改下入口即可使用），为什么不用大名鼎鼎的python呢？爬虫框架可是一堆堆，还是个人习惯作祟，用惯了js，操作网页简直得心应手，天生绝配！在此并不否认python,个人也比较喜欢（最近在研究深度学习构架），只是觉得爬这些网页，还用不着它。

有一个关键点，在网页中，想操作iframe中的网页，是不允许跨域的，而nw.js允许这样操作，真是好啊！！！
### 安装步骤
1. 下载nw.js ,根据自己系统下载相应版本即可，官网：https://nwjs.io/ ，若自己需要二次开发，请下载SDK版本，方可开启debug，使用方法详见官网，不再阐述
2. 克隆APSpider,复制到nw.js目录，启动cmd，打开到当前目录，执行 npm install 安装依赖
3. 启动nw.exe 就可以使用啦

### 使用说明
1. 考虑完整性，本客户端在读取到公众号列表及文章列表时，直接存储在article下的目录文件中，若需要将数据存储至数据库，请修改assest\utils\common.js中的Ap.request.ajax方法，将log函数注释，将下面被注释的代码恢复即可，然后在app\config.js中配置pushStateAPI（即后端接收数据API）为自己的数据接口即可
2. 由于新榜在公众号详细页面设置了登录权限（如：https://www.newrank.cn/public/info/detail.html?account=rmrbwx），
只有登录后可访问，并且获取公众号文章的接口：https://www.newrank.cn/xdnphb/detail/getAccountArticle ，
也是带了安全校验字段，所以登录是必须要走的过程，所以点击登录后，程序打开登录页面，并获取二维码，如图：
![](https://raw.githubusercontent.com/wiki/inmyjs/apspider/images/2.png)
用自己的微信扫一扫，授权登录即可，程序自动进入公众号列表：https://www.newrank.cn/public/info/list.html?period=day&type=data
![](https://raw.githubusercontent.com/wiki/inmyjs/apspider/images/3.png)
3. 选择行业，点击开始即可，程序将获取所选行业下公众号的热门文章及最新发布文章，并存储至文件中
> 最初的版本是一键获取全部行业的文章，后面想想，还是自己想获取哪些行业的就获取哪些行业的

![](https://raw.githubusercontent.com/wiki/inmyjs/apspider/images/4.png)
这是我的后台效果：
![](https://raw.githubusercontent.com/wiki/inmyjs/apspider/images/5.png)
![](https://raw.githubusercontent.com/wiki/inmyjs/apspider/images/6.png)

### 其他
1. 新榜的所有ajax都带有安全校验字段和cookie，cookie倒是好办，登录后获取cookie存储起来，带到ajax的请求头中即可，至于校验字段，着实费了一些时间，这个不再这里详述破解方法，有时间我会在csdn中写写破解的思路。
2. 关键词搜索还没做完，有时间补上。
3. 原本计划把微博、简书等一并爬了，忙于其他事务，就落下了。
