const koarouter = require('koa-router');
const config = require('./config');
const folder = require('./folder');
let router = new koarouter(config.get('app.router'));

router.controller = function (file) {
    let classname = null;
    let type = typeof (file);
    if (type == 'string') {
        if (file.indexOf('_controller') < 0) {
            file += '_controller';
        }
        classname = require(folder.base('app/controllers/' + file));
    } else if (type == 'function') {
        if (file.toString().startsWith('class')) {
            classname = file;
        } else {
            classname = function (context) {
                this.context = context;
                this.index = file;
            }
        }
    } else {
        throw new Error('controller type invalid');
    }
    return classname;
}

//controller
router.action = function (file, method) {
    return async function (context) {
        let classname = router.controller(file);
        let controller = new classname(context);
        let action = controller[method ?? 'index'];
        context.assert(action, 'Page Not Found', 404);
        action = action.bind(controller);
        let response = await action(...arguments);
        if (response && response.body) {
            for (let i in response) {
                context.response[i] = response[i];
            }
        } else {
            context.tyep = 'text/plain';
            context.body = response ?? '';
        }
    }
}

router.resource = function () {
    let name = null;
    let path = null;
    let ctrl = null;
    let middleware = [];
    let args = Object.values(arguments);
    if (typeof (args[0]) == 'string' && typeof (args[1]) == 'string') {
        name = args.shift();
        path = args.shift();
    } else {
        path = args.shift();
    }
    for (let i in args) {
        if (typeof (args[i]) == 'function') {
            if (args[i].toString().startsWith('class')) {
                ctrl = args[i];
            } else {
                middleware.push(args[i]);
            }
        }
    }
    if (name) {
        router.get(name, path, ...middleware, router.action(ctrl, 'grid'));
        router.get(name + '.id', path + '/:id', ...middleware, router.action(ctrl, 'show'));
    } else {
        router.get(path, ...middleware, router.action(ctrl, 'grid'));
        router.get(path + '/:id', ...middleware, router.action(ctrl, 'show'));
    }
    router.put(path + '/:id', ...middleware, router.action(ctrl, 'update'));
    router.post(path, ...middleware, router.action(ctrl, 'create'));
    router.put(path, ...middleware, router.action(ctrl, 'form'));
    router.delete(path, ...middleware, router.action(ctrl, 'delete'));
}

//middleware
router.next = function (func) {
    if (typeof (func) == 'string') {
        return require(folder.base('app/middlewares/' + func));
    } else {
        return func;
    }
}

module.exports = router;