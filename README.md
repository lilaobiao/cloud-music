# react hooks+redux+immutable.js仿网易云音乐打造精美webApp

打开方式:
1. 先将项目 clone 到本地
```shell
$ git clone ...
```

以下命令没有科学上网的朋友，建议使用 cnpm
```shell
$ cd cloud-music
$ npm install

// 下载子模块，这里面主要是api
$ git submodule update --init --recursive
$ cd NeteaseCloudMusicApi
$ npm install
$ cd ../  (注意: 一定要返回到上一层)
```

2. 运行，根目录下执行命令
```shell
$ npm run start
```

当然，你也可以分别启动api服务，在NeteaseCloudMusicApi目录下
```shell
$ npm run start
```
和客户端服务，在根目录下
```shell
$ npm run start:react
```

现在就在本地的3000端口访问了。如果要打包到线上，执行 `npm run build` 即可。


项目介绍:

本项目来自 github 开源项目本人在学习 react 时，参考本项目学了很多知识点。[项目原地址](https://github.com/sanyuan0704/react-cloud-music)

我当时克隆该项目的时间是 2019-11-7。

个人修改过的地方：

1. 删除了个人认为多出来的一层 div 包装 BlankLayout，见 src/routes/index.js 注释掉部分。

2. 修改了 Home-Layout.js 多出来的一层 div，将最外层的 `<div></div>` 改成了 `<></>`。

3. 加了一些注释，因为自己刚学 react, 很多地方看不懂，所以网上查资料加上了注释，方便自己理解。

4. readme 文件


个人认为项目不太友好的地方（只是个人观点）：

1. 所有的页面使用了 fixed 来将内容固定在页面的固定地方，比如首页，除了顶部的固定内容，其他内容也是通过 fixed 定位的：
```cs
  position: fixed;
  top: 90px;
  left: 0;
  bottom: 60px;
  width: 100%;
```
如果是我个人做的话，我会把 id 为 "root" 的 div 的高度设置成100vh，然后设置一个 padding-top 值，用于留给顶部的 tab，剩下的高度全部给大容器即可。

2. 项目用了阿里的图标库，但使用的方式不是加样式名，而是把图表内容写在标签体内，个人感觉不友好，以搜索图标为例
```html
<span
  className="iconfont search"
  onClick={() => props.history.push("/search")}
>
  &#xe62b;
</span>
```

个人更建议下面的用法，一眼就能根据样式名看出图标的大概意思，标签体也没内容(而且是用户看不到的无关内容)，十分干净
```html
<span
  className="iconfont search icon-search"
  onClick={() => props.history.push("/search")}
></span>
```
