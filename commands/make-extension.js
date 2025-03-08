const folder = require('../folder');
const program = require('../program');

program.command('make:extension')
    .description('Bootstrap a extension')
    .argument('<string>', 'Extension name')
    .action((name) => {
        let target = folder.base('provider/bootstraps/' + name + '.js');
        let stubfc = folder.root('commands/make-stubs/extension.js');
        folder.stub(target, stubfc, { pkg: name });
    });