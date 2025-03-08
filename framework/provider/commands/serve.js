const { app, router, folder, program } = require('kmola');

program.command('serve')
    .description('Start server')
    .argument('[port]', 'Server Port', '3000')
    .action(function (port) {
        if (process.env.APP_ENV == 'development') {
            folder.watchdirs(folder.base('app'), (event, file, path) => event == 'change' && app.reload(path + '/' + file));
        }
        app.use(router.routes()).use(router.allowedMethods());
        app.listen(port, function () {
            console.log('Server Port: ' + port + ' Started...');
        });
    });