const folder = require('../folder');
const program = require('../program');

program.command('seed')
    .description('Seeder executes')
    .argument('[string]', 'Only the File')
    .action(async (file) => {
        let files = {};
        if (file) {
            files[file] = require(folder.base('resource/seeders/' + file));
        } else {
            files = folder.imports(folder.base('resource/seeders'));
        }
        for (let i in files) {
            let item = new (files[i]);
            await item.seeder();
            console.log(i + ' seed has been executed');
        }
        process.exit(0);
    });