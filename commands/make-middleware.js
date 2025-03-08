const folder = require('../folder');
const program = require('../program');

program.command('make:middleware')
    .description('Create a Middleware')
    .argument('<string>', 'Middleware name')
    .action((name) => {
        let target = folder.base('app/middlewares/' + name + '.js');
        if (!folder.fs.existsSync(file)) {
            let stubfc = folder.root('commands/make-stubs/middleware.js');
            folder.stub(target, stubfc);
            console.log(name + ' middleware has been generated');
        } else {
            console.log(name + ' middleware already exists.');
        }
    });