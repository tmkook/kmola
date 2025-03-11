module.exports = async (context, next) => {
    const user = require('../models/user');
    context.assert(user.auth(context), 401, 'please login!');
    context.assert(user.can(context), 405, 'Permission denied!');
    return await next();
}