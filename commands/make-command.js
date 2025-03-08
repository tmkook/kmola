const folder = require('../folder');
const program = require('../program');

program.command('make:command')
    .description('Create a Command')
    .argument('<string>', 'Command name')
    .action((name) => {
        let target = folder.base('provider/commands/' + name + '.js');
        if (!folder.fs.existsSync(file)) {
            let stubfc = folder.root('commands/make-stubs/command.js');
            folder.stub(target, stubfc, { name: name });
            console.log(name + ' command has been generated');
        } else {
            console.log(name + ' command already exists.');
        }
    });