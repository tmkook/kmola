const { app, config, logger, locale } = require('kmola');

//error logging
app.prependListener('error', (stream) => {
    if (!stream.nolog) {
        logger.error(stream.stack);
    }
});

//access logging
app.use((context, next) => {
    logger.http({ url: context.request.origin, method: context.request.method, ip: context.request.ip, proxy: context.request.ips });
    return next();
});

//locale
app.use((context, next) => {
    context.locale = new locale(context);
    return next();
});

//database
const { sutando, Paginator } = require('sutando');
const database = config.get('database', {});
for (let name in database) {
    sutando.addConnection(database[name], name);
}

//page formatter
Paginator.setFormatter((paginator) => {
    return {
        total: paginator.total(),
        count: paginator.count(),
        page: paginator.currentPage(),
        last: paginator.lastPage(),
        more: paginator.hasMorePages(),
        rows: paginator.items().toData(),
    };
});