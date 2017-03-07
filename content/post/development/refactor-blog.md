+++
author = "microcandy"
categories = ["Development", "gulp", "hugo"]
date = "2017-03-04T18:59:44+08:00"
description = "简单地重构一下blog工程"
featured = "refactor-blog-00.png"
featuredalt = "refactor-blog"
featuredpath = "/img/2017/03"
linktitle = ""
title = "hugo blog工程重构"

+++

# **主题样式**

相对于[原版主题](https://github.com/jpescador/hugo-future-imperfect)修改了不少样式，其实是删了不少：

删掉了头像部分：在移动端太占地方，花里胡哨

删掉每篇文章顶部的分享栏

删掉左侧边栏的about栏目

删掉了搜索

部分~~汉化~~

有一个是不少主题都有的问题：这个为例，弹出右侧菜单的时候，会有一个类似背景遮罩（`backdrop`）的东西，监听的是`click touchend`事件，那么在**移动端**会出现，按住不放可以滑动遮罩后面的元素（这个主题的话，移动的是整个`body`）
```javascript
// Body.
  // Event: Hide panel on body click/tap.
  $body.on('click touchend', function(event) {
    $this._hide(event);
  });
```

一开始打算改成监听`touchstart`。
```javascript
// Body.
  // Event: Hide panel on body click/tap.
  $body.on('click touchstart', function(event) {
    $this._hide(event);
  });
```

看起来很美好，但是点击事件击穿了，点击遮罩，遮罩后的`a`标签接收到了点击事件。其实也不是真正的击穿，因为事件监听本身就加在`body`上的，而不是遮罩上。所以我把`body`的监听移除了，直接加在了遮罩上
```javascript
  // Event: Hide panel on body click/tap.
  // $body.on('click touchstart', function(event) {
    // $this._hide(event);
  });
  $('#wrapper').on('click touchstart', function(event) {
    $this._hide(event);
  });
```
暂时没毛病

# **合并丑化**

工作中用的是[gulp](http://gulpjs.com/)（本篇封面），没用过[grunt](http://gruntjs.com/)。

全局搜索了一下，在两个文件中分别引入了js和css文件，至于语法高亮的代码，暂时没合并进来。

**css**

在`future/layout/partials/header.html`中

```html
<link rel="stylesheet" href="/css/google-font.css" />
<link rel="stylesheet" href="/css/font-awesome.min.css" />
<link rel="stylesheet" href="/css/main.css" />
<link rel="stylesheet" href="/css/add-on.css" />
<link rel="stylesheet" href="/css/monokai-sublime.css">
```

**js**

在`future/layout/partials/footer.html`中

```html
<script src="/js/jquery.min.js"></script>
<script src="/js/skel.min.js"></script>
<script src="/js/util.js"></script>
<script src="/js/main.js"></script>
<script src="/js/backToTop.js"></script>
<script src="/js/highlight.pack.js"></script>
```

这些`js`文件不在`head`标签中，而是在`body`标签里，所以不会阻塞页面渲染。在绝大多数浏览器中都能并行下载，不过，它们必须都全部加载完才会执行，所以，这里的顺序是不能乱的，最简单的道理，库代码先于业务逻辑代码。`highlight`是后来才引的。

所以，我们合并出来的js文件，也要按这个顺序合并。这里有一个不错的gulp插件：[gulp-order](https://www.npmjs.com/package/gulp-order)

可以让代码在合并时遵循指定的规则

```javascript
// gulpfile.js
// 我们想要的顺序
var jsFilePath = [
  'themes/future/static/js/jquery.min.js',
  'themes/future/static/js/skel.min.js',
  'themes/future/static/js/util.js',
  'themes/future/static/js/main.js',
  'themes/future/static/js/backToTop.js',
  'themes/future/static/js/hightlight.pack.js'
];

// 合并Js
gulp.task('js', function () {
  return gulp.src(jsFilePath)
    .pipe(order(jsFilePath, { base: './' }))
    .pipe(uglify())
    .pipe(concat('script.bundle.js'))
    .pipe(gulp.dest('themes/future/static/js'));
});

```

类似的
```javascript
var cssFile = [
  'themes/future/static/css/google-font.css',
  'themes/future/static/css/font-awesome.min.css',
  'themes/future/static/css/monokai-sublime.css',
  'themes/future/static/css/main.css',
  'themes/future/static/css/add-on.css'
]
gulp.task('css', function () {
  return gulp.src(cssFile)
    .pipe(order(cssFile, { base: './' }))
    .pipe(concat('style.bundle.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest('themes/future/static/css'));
});
```

最后不要忘记引入

```html
<!-- css -->
<link rel="stylesheet" href="/css/style.bundle.css" />
<!--<link rel="stylesheet" href="/css/google-font.css" />
<link rel="stylesheet" href="/css/font-awesome.min.css" />
<link rel="stylesheet" href="/css/main.css" />
<link rel="stylesheet" href="/css/add-on.css" />
<link rel="stylesheet" href="/css/monokai-sublime.css">-->

<!-- js -->
<script src="/js/script.bundle.js"></script>
<!--<script src="/js/jquery.min.js"></script>
<script src="/js/skel.min.js"></script>
<script src="/js/util.js"></script>
<script src="/js/main.js"></script>
<script src="/js/backToTop.js"></script>
<script src="/js/highlight.pack.js"></script>-->
```

大概就干了这么些，可以安心写文了
