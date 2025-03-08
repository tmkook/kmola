<div align="center">
  <img src="https://github.com/tmkook/kmola/blob/main/framework/resource/assets/img/logo.png?raw=true" width="100" alt="Kmola logo" />
  <h1 align="center"><a href="https://kmola.com">Kmola-Framework</a></h1>
</div>

Kmola 是一个基于 Koa 的 MVC 框架，深受 Laravel 框架的启发，使用方式几乎相同。具有小巧快速的特性，可以让您轻松优雅的开发。Kmola 提供了丰富的 CLI 功能，通过命令行脚手架 1 分钟即可生成 CURD 功能。

# 开始
例如创建一个名为「example-app」的项目，并在该目录执行命令（Windows 请在 `WSL2` 中执行）  
```
npm i kmola sutando sqlite3 & cp -rf node_modules/kmola/framework/* ./
```
数据库继承自 sutando 包，默认驱动为 sqlite3 你也可以修改为其他支持的驱动 `pg` `sqlite3` `better-sqlite3` `mysql` `mysql2` `tedious` 详细使用方法请查阅 <a href="https://github.com/sutandojs/sutando">sutando</a>

# 启动
安装完成后通过 `artisan` 命令来启动 http 服务，通常默认端口为 3000 即访问 `http://localhost:3000` 即可
```
// 查看全部 artisan 命令
node artisan --help

// 查看 serve 命令详情
node artisan serve --help

// 启动默认端口
node artisan serve

// 启动自定义端口
node artisan serve 8080
```

# 部署
当你准备将 kmola 应用程序部署到生产环境时，你可以做一些重要的事情来确保应用程序尽可能高效地运行。
1. 修改 `.env` 文件中的 `APP_ENV` 选项为 `production` 生产模式，和 `APP_LOG`日志等级为 `error` 来减少日志。
2. 安装 PM2 管理和守护您的应用程序进程。使用方法请查阅 <a href="https://pm2.keymetrics.io/docs/usage/quick-start">PM2文档</a>
3. 安装 nginx 配置 SSL 证书，或使用 cloudflare 保护您的应用安全。

# 目录结构
默认的文件结构旨在为应用程序提供一个良好的起点。但是你可以自由地组织你的应用程序。kmola 几乎不会限制任何给定类的位置。

## app 目录
app 目录包含应用程序核心代码，你的业务中几乎所有代码将在此目录中。

## config 目录
config 目录，顾名思义，包含所有应用程序的配置文件。建议你阅读所有这些文件并熟悉所有可用选项。

## provider 目录
provider 目录中包含  `bootstraps` 和 `commands` 两个模块。他们都会在框架初始化时自动加载。
你可以在 `bootstraps` 中添加一些全局的初始化操作，也可以使用 `make:extension <你的包名>` 命令来引入一个 kmola 扩展。
`commands` 中的文件为所有自定义的 artisan 命令，这些文件可以使用 `make:command` 命令生成。

## public 目录
public 目录包含你的资源文件，例如图片、JavaScript 和 CSS。

## resource 目录
resources 目录包含你的语言、数据迁移、数据填充、以及原始未编译的静态资源文件。

## routes 目录
routes 目录包含应用程序的所有路由定义。默认情况下 kmola 包含一个 web.js 文件，你可以按需求创建路由文件，他们会在服务启动时自动载入。

## storage 目录
storage 目录包含日志、上传、缓存、迁移及sqlite3数据库文件。

# 请求周期
kmola 应用程序的所有请求的入口点都是 artisan 文件。当执行一个 artisan 命令时将按如下顺序检索加载并初始化框架。
```
dotenv -> config -> bootstrap -> routes -> commands
```

# 插件扩展
kmola 自带了一个 koamis 后台管理系统，配合百度 amis 只需很少的代码即可快速构建出一个功能完善的高颜值后台系统。
```
// 安装扩展
npm install koamis

// 将插件添加到框架
node artisan make:extension koamis

// 初始化框架资源
node artisan koamis:install

// 执行数据库迁移
node artisan migrate
```
