+++
author = "microcandy"
categories = ["Development", "Github", "hugo"]
date = "2016-05-16T00:44:25+08:00"
description = "How to create a blog based on hugo & Github Pages."
featured = "how-to-hugo-01.png"
featuredalt = ""
featuredpath = "date"
linktitle = ""
title = "搭建静态博客：hugo & github"

+++

# hugo安装与使用

参照[Getting Started](https://gohugo.io/overview/quickstart/)进行（Windows7）

- **安装**

>Save the main executable as **hugo** (or **hugo.exe** on Windows) somewhere in your **PATH** as we will be using it in the next step.

把下载好的hugo.exe随便放个地方，并且添加到Path中。也就是在：我的电脑-右键-属性-高级系统设置-环境变量中进行添加。

（假设hugo.exe我放在C:\hugo中，则在path变量中加入`;C:\hugo`）

- **创建一个网站**

```shell
$ hugo new site blog
```

项目结构具体说明看官网的[Getting Started](https://gohugo.io/overview/quickstart/)，生成的目录中主要用到static、content、config.toml，后续会使用网站主题

>**config.toml**: Every website should have a configuration file at the root.  
>**content**: This is where you will store content of the website. Inside content, you will create sub-directories for different sections.  
>**static**: This directory is used to store all the static content that your website will need like images, CSS, JavaScript or other static content.

- **添加新内容**

创建命令
```shell
$ hugo new post/how-to-hugo.md
```

期望的输出
```shell
xxxx\content\post\how-to-hugo.md created
```

**注意**[Getting Started](https://gohugo.io/overview/quickstart/)**中提醒到：**

>Make sure you are inside your website directory.

那么这个how-to-hugo.md默认应该差不多这个样子（如果使用了主题的话可能会有出入）

```
+++
date = "2016-05-16T00:44:25+08:00"
draft = true
title = "how to hugo"

+++
```

然后就可以写这篇文章了。

- **运行**

hugo内置了一个服务器使得我们可以在http://localhost:1313/ 预览我们的网站

>Hugo has an inbuilt server that can serve your website content so that you can preview it.  
>This will start the server on port 1313. You can view your blog at http://localhost:1313/. 

```shell
$ hugo server
```

期望中的结果是没有任何输出。因为我们新建的how-to-hugo.md是一篇草稿`raft = true`，可以考虑设置为false（推荐），或者

>To render drafts, re-run the server with command shown below.

```shell
$ hugo server --buildDrafts
```

- **使用主题**

为什么要使用主题？（本着不重复造轮子的理念、不会写前端、懒...）

好吧，官方这说的很有道理

>Hugo currently doesn’t ship with a **default** theme, allowing the user to pick whichever theme best suits their project.

在[hugo主题](http://themes.gohugo.io/)里挑选喜欢的主题，点击【DEMO】可以看到预览，之后点击【HOMEPAGE】可以前往托管在Github的主题，把它下下来。

主题下好之后解压然后重命名成一个较短的新名字（后面本地预览时要输入主题的文件名），放在项目根目录下themes文件夹中（新建一个），之后预览带主题的网站效果。（也可以参照[Getting Started](https://gohugo.io/overview/quickstart/)里面用Git命令clone主题）

```shell
$ hugo server --theme=theme-name --buildDrafts
```

- **公开**

>So far all the posts that we have written are in draft status. To make a draft public, you can either run a command or manually change the draft status in the post to True.  
>$ hugo undraft content/post/good-to-great.md

噢？网页还是草稿`draft = true`？用命令行去解决吧~

看起来挺麻烦，开文件手改吧。

现在它已经不是草稿了，可以不用`--buildDrafts`了。（记得带上主题）

```shell
$ hugo server --theme=theme-name
```

- **生成、部署**

这里打算部署到Github Pages上。

先创建一个Repository，名为yourGithubID.github.io

之后生成我们的网站，生成命令就是去掉`server`参数

```shell
$ hugo --theme=theme-name --baseUrl="http://yourGithubID.github.io/
```

之后会在项目根目录下生成一个public文件夹

>After you run the hugo command, a public directory will be created with the generated website source.

运行Git Shell，进入这个public目录下，将目录下所有文件push到刚创建的Repository的master分支（也可以考虑参照[Getting Started](https://gohugo.io/overview/quickstart/)新建一个分支）。

```shell
$ cd public
$ git init
$ git remote add origin https://github.com/yourGithubID/yourGithubID.github.io.git
$ git add -A
$ git commit -m "first commit"
$ git push -u origin master
```

不出意外的话，`http://yourGithubID.github.io/` 这就是成果了。

- **代码高亮**

如果是~~技术~~博客，可以考虑使用代码高亮插件，官网[点这里](https://highlightjs.org/)，选则需要的高亮语言然后下载。

根据hugo[Getting Started](https://gohugo.io/overview/quickstart/)的意思，这东西应该放在static目录下，假设放在static\highlight下。

最直接的使用方法就是（见highlight\README.MD）

>The bare minimum for using highlight.js on a web page is linking to the library along with one of the styles and calling *initHighlightingOnLoad*:

```html
<link rel="stylesheet" href="/path/to/styles/default.css">
<script src="/path/to/highlight.pack.js"></script>
<script>hljs.initHighlightingOnLoad();</script>
```

我们刚刚假设我们的高亮插件放在static\highlight下，那么path/to应该换成highlight

```html
<link rel="stylesheet" href="/highlight/styles/default.css">
<script src="/highlight/highlight.pack.js"></script>
<script>hljs.initHighlightingOnLoad();</script>
```

那么在贴代码时指定语言即可

```html
    ```html  
    <link rel="stylesheet" href="/highlight/styles/default.css">  
    ```  
```

- **评论**

许多主题都提供了[Disqus](https://disqus.com/)评论模块的接口，只需要申请帐号并且设置一下就可以使用了。提供的都是国外的社交软件，所以就放弃了。这里使用[友言](http://www.uyan.cc/)评论系统。

[友言](http://www.uyan.cc/)不能在本地预览中使用，只有部署到Github Pages之后才能正常使用。

在[友言](http://www.uyan.cc/)注册后直接选择获取代码-通用代码，会得到形如下面的一段代码，放在需要放的地方

```html
<div id="uyan_frame"></div>
<script type="text/javascript" src="http://v2.uyan.cc/code/uyan.js?uid=一串数字"></script>
```

- **之后的事**

之后就是如何好好使用主题的问题了，只能参照主题给的sample或者文档来弄了。

- 2016-5-17

想更新博客了怎么办。尝试了下，用Github客户端直接添加public文件夹，当public文件夹有更新会自动识别，然后点（Commit）点（Sync）完事

另外，感觉Github客户端的上传速度（60k）比Git Shell（6-10k）快啊，都是大半夜推的，辣鸡校园网。

然后，准备把csdn上的旧文挑点搬过来~~充~~（bai）~~实~~（she）一下。