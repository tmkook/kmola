<div align="center">
  <img src="https://raw.githubusercontent.com/tmkook/kmola/resource/img/logo.png" width="100" alt="Kmola logo" />
  <h1 align="center"><a href="https://kmola.com">Kmola-Framework</a></h1>
</div>

Kmola 是一个 Koa MVC 框架，深受 Laravel 框架的启发，使用方式几乎相同。具有小巧快速的特性，可以让您轻松优雅的开发。Kmola 提供了丰富的 Cli 功能，通过命令行脚手架 1 分钟即可生成 CURD 功能。

# 开始
Linux 和 MacOS 请在控制台中执行，Windows 请在（WSL2）中执行。
```
curl -s "https://raw.githubusercontent.com/tmkook/nodcat/main/shell/install.sh" | bash -s example-app
```

# 启动
kmola 安装完成后，可通过 `artisan` 命令来启动 http 服务并访问 `localhost:3000` 想要查看命令详情可使用 `--help` 选项。
```
 //启动服务
node artisan serve

 //查看 serve 命令详情
node artisan serve --help

//查看全部 artisan 命令
node artisan --help
```

# 部署
当你准备将 kmola 应用程序部署到生产环境时，你可以做一些重要的事情来确保应用程序尽可能高效地运行。
1. 确保您的 node 版为 20 以上
2. 修改 `.env` 文件中的 `APP_ENV` 选项为 `production` 生产模式
3. 安装 PM2 管理和守护您的应用程序进程。使用方法请查阅 <a href="https://pm2.keymetrics.io/docs/usage/quick-start">PM2文档</a>

# 目录结构
- app
  - controllers
  - middlewares
  - models
  - views
- config
- provider
- public
- resource
  - assets
  - locales
  - migrations
  - seeders
- routes
- storage
- artisan

## app 目录
app 目录包含应用程序核心代码，你的业务中几乎所有代码将在此目录中。

## config 目录
config 目录，顾名思义，包含所有应用程序的配置文件。建议你阅读所有这些文件并熟悉所有可用选项。

## provider 目录
provider 目录中包含  `bootstraps` 和 `commands` 两个模块。他们都会在框架初始化时自动加载。
`bootstraps` 你可以在这里添加一些全局的初始化操作，也可以使用 `make:extension <你的包名>` 命令来引入一个 kmola 扩展。
`commands` 中的文件为所有自定义的 artisan 命令，这些命令可以使用 `make:command` 命令生成。

## public 目录
public 目录包含你的资源文件，例如图片、JavaScript 和 CSS。

## resource 目录
resources 目录包含你的 语言、数据迁移、数据填充、以及原始未编译的静态资源文件。

## routes 目录
routes 目录包含应用程序的所有路由定义。默认情况下 kmola 包含一个 web.js 文件，你可以按需求创建路由文件，他们会在服务启动时自动载入。

## storage 目录
storage 目录包含日志、上传、缓存、迁移及sqlite3数据库文件。

## Model 模型
Model 继承自 sutando 他的使用方式与 Laravel 框架的 Eloquent 几乎相同。使用方法请查阅 <a href="https://github.com/sutandojs/sutando">Sutando</a>