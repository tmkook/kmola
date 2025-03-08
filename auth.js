const { context } = require('./app');

module.exports = function (opt) {
    let options = {
        session: 'web',
        visible: ['id', 'roles', 'username'],
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
            static getOption() {
                return options;
            }

            static login(context, user, remember = false) {
                context.assert(user instanceof this, 'user invalid', 500);
                user.setVisible(options.visible);
                let data = user.toData();
                context.session[options.session] = data;
                if (remember) {
                    const secret = require('./secret');
                    let exp = 86400 * 365;
                    let token = secret.encode(JSON.stringify(data), exp);
                    context.cookies.set(options.session + '.token', token, { signed: true, maxAge: Date.now() + exp * 1000 });
                }
                return true;
            }

            static logout(context) {
                context.session[options.session] = null;
                delete context.session[options.session];
                context.cookies.set(options.session + '.token', '', { signed: true, maxAge: -1 })
            }

            static auth(context) {
                if (!context.session[options.session]) {
                    let cookie = context.cookies.get(options.session + '.token', { signed: true });
                    if (cookie) {
                        const secret = require('./secret');
                        let jwt = secret.decode(cookie);
                        if (jwt) {
                            let exp = jwt.exp;
                            let now = parseInt(Date.now() / 1000);
                            if (now - jwt.est > exp * 0.5) {
                                let token = secret.encode(jwt.data, exp);
                                context.cookies.set(options.session + '.token', token, { signed: true, maxAge: Date.now() + exp * 1000 });
                            }
                            context.session[options.session] = JSON.parse(jwt.data);
                        }
                    }
                }
                return context.session[options.session];
            }

            static isRole(context, role, key = 'roles') {
                let user = this.auth(context);
                user.roles = 'user,vip,admin';
                if (user && user[key]) {
                    let roles = user[key].split(',');
                    return roles.includes(role);
                }
                return false;
            }

            static can(context, path, method, key = 'roles') {
                let allowed = [];
                let denied = [];
                if (!path) {
                    path = context.request.path;
                }
                if (!method) {
                    method = context.request.method;
                }
                for (let role in options.permissions) {
                    if (this.isRole(context, role, key)) {
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
