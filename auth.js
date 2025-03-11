module.exports = function (opt) {
    let options = {
        rolesKey: 'roles',
        primaryKey: 'id',
        sessionKey: 'web',
        permissions: {
            user: [
                { path: "/.*", methods: "any", type: "allow" }
            ]
        }
    };

    let type = typeof (opt);
    if (type == 'string') {
        const config = require('./config');
        options = Object.assign(options, config.get(opt, {}));
    } else if (type == 'object') {
        options = Object.assign(options, opt);
    }

    return function (Model) {
        return class extends Model {

            /**
             * 获取验证器配置
             * @returns {json}
             */
            static getOption() {
                return options;
            }

            /**
             * 设置登录
             * @param {object} context 
             * @param {model} user 
             * @param {bool} remember 
             * @returns {bool}
             */
            static login(context, user, remember = false) {
                context.assert(user instanceof this, 'user invalid', 500);
                user.setVisible([options.primaryKey, options.rolesKey]);
                let data = user.toData();
                context.session[options.sessionKey] = data;
                if (remember) {
                    const secret = require('./secret');
                    let exp = 86400 * 365;
                    let token = secret.encode(JSON.stringify(data), exp);
                    context.cookies.set(options.sessionKey + '.token', token, { signed: true, maxAge: Date.now() + exp * 1000 });
                }
                return true;
            }

            /**
             * 退出登录
             * @param {object} context 
             */
            static logout(context) {
                context.session[options.sessionKey] = null;
                delete context.session[options.sessionKey];
                context.cookies.set(options.sessionKey + '.token', '', { signed: true, maxAge: -1 })
            }

            /**
             * 获取登录信息
             * @param {object} context 
             * @returns {json|undefined}
             */
            static auth(context) {
                if (!context.session[options.sessionKey]) {
                    let cookie = context.cookies.get(options.sessionKey + '.token', { signed: true });
                    if (cookie) {
                        const secret = require('./secret');
                        let jwt = secret.decode(cookie);
                        if (jwt) {
                            let exp = jwt.exp;
                            let now = parseInt(Date.now() / 1000);
                            if (now - jwt.est > exp * 0.5) {
                                let token = secret.encode(jwt.data, exp);
                                context.cookies.set(options.sessionKey + '.token', token, { signed: true, maxAge: Date.now() + exp * 1000 });
                            }
                            context.session[options.sessionKey] = JSON.parse(jwt.data);
                        }
                    }
                }
                return context.session[options.sessionKey];
            }

            /**
             * 获取登录用户模型
             * @param {object} context 
             * @returns {model}
             */
            async user(context) {
                let info = this.auth(context);
                return this.query().where(options.primaryKey, info[options.primaryKey]).first();
            }

            /**
             * 是否有角色
             * @param {object} context 
             * @param {string} role 
             * @returns {bool}
             */
            static isRole(context, role) {
                let key = options.rolesKey;
                let user = this.auth(context);
                if (user && user[key]) {
                    let roles = user[key].split(',');
                    return roles.includes(role);
                }
                return false;
            }

            /**
             * 是否有权限
             * @param {object} context 
             * @param {string} path 
             * @param {string} method 
             * @returns {bool}
             */
            static can(context, path, method) {
                let allowed = [];
                let denied = [];
                if (!path) {
                    path = context.request.path;
                }
                if (!method) {
                    method = context.request.method;
                }
                for (let role in options.permissions) {
                    if (this.isRole(context, role)) {
                        let roles = options.permissions[role];
                        for (let i in roles) {
                            let item = roles[i];
                            if (item.type == 'allow') {
                                allowed.push(item);
                            } else {
                                denied.push(item);
                            }
                        }
                    }
                }

                //匹配不允许的
                for (let i in denied) {
                    let item = denied[i];
                    if (path.match(new RegExp('^' + item.path + '$', 'i')) && (item.methods == 'any' || item.methods == 'all' || method.match(new RegExp(item.methods, 'i')))) {
                        return false;
                    }
                }

                //匹配允许的
                for (let i in allowed) {
                    let item = allowed[i];
                    if (path.match(new RegExp('^' + item.path + '$', 'i')) && (item.methods == 'any' || item.methods == 'all' || method.match(new RegExp(item.methods, 'i')))) {
                        return true;
                    }
                }

                //允许不允许
                return false;
            }
        }
    }
}
