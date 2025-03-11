<div align="center">
  <img src="https://github.com/tmkook/kmola/blob/main/framework/resource/assets/img/logo.png?raw=true" width="100" alt="Kmola logo" />
  <h1 align="center"><a href="https://kmola.com">Kmola-Framework</a></h1>
</div>

kmola 是一个基于 koa 的 mvc 框架，深受 laravel 框架的启发，使用方式几乎相同。具有小巧快速的特性，可以让您轻松优雅的开发。Kmola 提供了丰富的 cli 功能，通过命令行脚手架 1 分钟即可生成 curd 功能。

kmola 还提供了一个 <a href="https://github.com/tmkook/koamis">koamis</a> 扩展，配合百度 amis 只需很少的代码即可快速构建出一个功能完善的高颜值后台系统。

# 安装
例如要创建一个名为「example-app」的项目，请打开终端（Windows 使用 WSL2）在该目录执行命令。数据库继承自 sutando 包，默认驱动为 sqlite3 你也可以修改为其他支持的驱动 `pg` `sqlite3` `better-sqlite3` `mysql` `mysql2` `tedious` 详细使用方法请查阅 <a href="https://github.com/sutandojs/sutando">sutando</a>
```
npm i kmola sutando sqlite3 & cp -rf node_modules/kmola/framework/* ./
```

安装完成后通过 `artisan` 命令检查是否安装成功。
```
node artisan --help
```

# 启动
启动 http 服务，通常默认端口为 3000 即访问 `http://localhost:3000` 即可
```
node artisan serve
```

你也可以启动一个自定义端口服务，然后访问 `http://localhost:8080` 即可
```
node artisan serve 8080
```

# 部署
当你准备将应用程序部署到生产环境时，你可以做一些事情来确保应用程序尽可能高效地运行。
1. 执行 `mke:env` 命令生成 env 文件将 APP_ENV 选项设为 production 和 APP_LOG 等级设为 error 减少日志。
2. 安装 <a href="https://pm2.keymetrics.io/docs/usage/quick-start">PM2</a> 管理和守护您的应用程序进程。
3. 安装 nginx 配置 SSL 证书，或使用 cloudflare 保护您的应用安全。

# 请求周期
kmola 应用程序的所有请求的入口点都是 artisan 文件。当执行一个 `artisan` 命令时将按如下顺序检索加载并初始化框架。
```
dotenv -> config -> bootstrap -> routes -> commands
```

# 服务提供者
provider 目录中包含  `bootstraps` 和 `commands` 两个文件夹。他们都会在框架初始化时自动加载。
你可以在 `bootstraps` 中添加一些全局的初始化操作，也可以使用 `make:extension <你的包名>` 命令来导入一个 kmola 扩展。
`commands` 中的文件为所有自定义的 artisan 命令，这些文件可以使用 `make:command` 命令生成。

# 路由
路由继承自 <a href="https://github.com/koajs/router/blob/master/API.md">koa-router</a> 包。 kmola 只在此之上扩展了 `next` `action` `controller` `resource` 方法。
```
const { router } = require('kmola');
router.get('/',(context) => {
    context.body = 'hello world';
});
```

## Action 路由
定义一个路由，映射到 `app/controllers/welcome_controller` 的 `index` 方法，控制器名称可忽略 `_controller` 后缀。
```
router.get('/',router.action('welcome','index'))
```

如果控制器在 `controllers/example/welcome_controller` 的 `index` 方法。
```
router.get('/',router.action('example/welcome','index'))
```

## Resource 路由
kmola 的控制器基类提供了 `grid` `show` `create` `update` `form` `delete` 六个基础方法，你只需要在控制器属性中绑定模型即可定义一个 `resource` 路由。
```
const {controller} = require('kmola');
const user = require('../models/user');
module.exports = class user_controller extends controller{
  model = user.query();
}
```

定义 resource 路由
```
router.resource('/user',router.controller('user'))
```

method | path  | action | about
get | /user | grid | 获取分页
get | /user/:id | show | 获取一个
post | /user | create | 创建一个
put | /user:id | udpate | 修改一个
put | /user | form | 创建或修改一个
delete | /user | delete | 删除一个或多个

# 中间件
中间件提供了一种方便的机制来检查和过滤进入应用程序的 HTTP 请求。例如，包含一个用于验证应用程序的用户是否经过身份验证。如果用户未通过身份验证，中间件将阻止访问应用。 如果用户通过了身份验证，中间件将允许请求进一步进入应用程序。

## 创建中间件
创建一个名为 auth 的中间件。
```
node artisan make:middleware auth
```

在中间件中使用验证器
```
module.exports = async (context, next) => {
    const user = require('../models/user'); //加载验证器
    context.assert(user.auth(context),401,'please login!'); // 判断是否登录
    context.assert(user.can(context),405,'Permission denied!'); //判断是否有权限
    return await next();
}
```

## 注册中间件
注册全局中间件，所有请求将进行身份验证。
```
router.use(router.next('auth'))
```

注册前缀中间件，所有 /user 的请求将进行身份验证。
```
router.use('/user', router.next('auth'));
```

批量注册中间件,所有 /user 和 /admin 的请求进行身份验证。
```
router.use(['/user', '/admin'], router.next('auth'));
```

在单个路由上注册中间件，仅 /user/info 的路由进行身份验证。
```
router.get('/user/info',router.next('auth'),router.action('welcome','index'))
```

# 验证器
kmola 提供了一个简单的验证器，若要完成一个有效的登录授权功能，请先在 config 目录下创建一个名为 `userauth` 的验证器配置文件。
```
module.exports = {
    session: 'user', // 会话的 key
    rokekey: 'roles', // 存储角色的字段名
    visible: ['id', 'roles', 'username', 'nickname'], // 会话存储的数据
    permissions: {
        user: [ //该角色拥有的权限
            { path: "/user/.*", methods: "any", type: "allow" }
            //path 为访问的路由 /user/.* 表示允许 /user/ 开头的所请求
            //methods 为 get,put,post,patch,delete 表示允许的路由方法 any 为全部
            //type 权限类型 allow 表示允许访问，disallow 表示不允许访问
        ]
    }
};
```

将验证器注册到 `app/models/user` 模型
```
const { Model, SoftDeletes, compose } = require('sutando');
const { auth } = require('kmola'); //加载验证器
const Authorize = auth('userauth'); //生成 userauth 配置文件的 Authorize 验证器扩展

module.exports = class user extends compose(Model, SoftDeletes, Authorize) { // 注册验证器
  //...
}
```

验证器使用
```
const user = require('../models/user');
let userinfo = await user.find(1);
user.login(context,userinfo,true); //true 为记住登录状态
user.logout(context);//退出登录
user.auth(context) //获取会话信息
user.user(context) //获取登录用户的 model
user.isRole(context,'admin'); //登录的用户是否拥有角色
user.can(context,'/user/info','get') //登录的用户是否拥有 `user/info` 的读取权限
```

# 响应
kmola 提供了一个基础返回结构体，他可以让你快速的返回整个 HTML 或者是 API JSON 结构
```
{ controller,view } = require('kmola')
module.exports = class welcome_controller extends controller{
  index(context){
    return view.json(); //返回json
    return view.jsonp('key',data); //返回json
    return view.error(msg,code); //返回一个错误json结构体 {status,msg}
    return view.success(data,code); //返回成功json结构体 {status,data}
    return view.render('welcome',data,options); //返回 ejs 编译后的 html
    this.view //也等同于 view
  }
}
```

# 本地化
本地化是将应用程序按照特定国家、地区或语言市场的需要进行加工，使之满足特定用户对语言和文化的特殊要求。
kmola 内置了一个简单的翻译器，要使用本地化，请先在 `resource/locales/zh/welcome.js` 创建对应的语言包文件。
```
module.exports = {
  "hello":"你好 :world。"
}
```
在控制器使用本地化
```
{ controller } = require('kmola')
module.exports = class welcome_controller extends controller{
  index(context){
    context.locale.set('zh');
    return context.locale.tr('welcome.hello',{world:"世界"});
  }
}
```
# 日志
为了帮助您更多地了解应用程序中发生的事情，kmola 内置了一个 winston 的日志对象，允许您将日志记录到文件。具体的使用方法请查阅 <a href="https://github.com/winstonjs/winston">winston</a>
```
{ logger } = require('kmola');
logger.error('a error');
logger.debug('a error');
logger.info('a error');
logger.warn('a error');
```
