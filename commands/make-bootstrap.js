const folder = require('../folder');
const program = require('../program');

program.command('make:bootstrap')
    .description('Create a Bootstrap')
    .argument('<string>', 'Pakcage name')
    .action((name) => {
        let target = folder.base('provider/bootstraps/' + name + '.js');
        let stubfc = folder.root('commands/make-stubs/bootstrap.js');
        folder.stub(target, stubfc, { pkg: name });
    });