const koarouter = require('koa-router');
const config = require('./config');
const folder = require('./folder');
let router = new koarouter(config.get('app.router'));

/**
 * 加载控制器对象
 * @param {string} file 
 * @returns {object}
 */
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

/**
 * 加载控制器方法
 * @param {string} file 
 * @param {string} method 
 * @returns 
 */
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
        } else if (typeof (response) == 'string') {
            context.response.type = 'text/plain';
            context.response.body = response ?? '';
        } else {
            if (!context.response.body) {
                context.response.body = 'No response data';
            }
        }
    }
}

/**
 * 加载中间件
 * @param {string} func 
 * @returns {function}
 */
router.next = function (func) {
    if (typeof (func) == 'string') {
        return require(folder.base('app/middlewares/' + func));
    } else {
        return func;
    }
}

module.exports = router;