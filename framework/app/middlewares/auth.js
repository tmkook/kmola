module.exports = async (context, next) => {
    context.assert(context.session['user'], 401, 'please login!', { nolog: true });
    return await next();
}