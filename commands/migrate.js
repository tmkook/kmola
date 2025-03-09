const folder = require('../folder');
const string = require('../string');
const program = require('../program');

async function up(step, logfile) {
    let executed = JSON.parse(folder.content(logfile, '{}'));
    let files = folder.imports(folder.base('resource/migrations'));
    let count = step > 0 ? parseInt(step) : 'all';
    for (let file in files) {
        if (count && !executed[file]) {
            executed[file] = string.timestamp();
            let migrate = new files[file];
            await migrate.up();
            console.log(file + ' done.');
            if (count > 0) count--;
        }
    }
    folder.fs.writeFileSync(logfile, JSON.stringify(executed));
    console.log('migration up steps: ' + step + ' executed.');
}

async function down(step, logfile) {
    let executed = JSON.parse(folder.content(logfile, '{}'));
    let files = folder.imports(folder.base('resource/migrations'));
    let count = step > 0 ? parseInt(step) : 'all';
    let loged = Object.keys(executed).reverse();
    for (let i in loged) {
        let file = loged[i];
        if (count) {
            delete executed[file];
            let migrate = new files[file];
            await migrate.down();
            console.log(file + ' done');
            if (count > 0) count--;
        }
    }
    folder.fs.writeFileSync(logfile, JSON.stringify(executed));
    console.log('migration up steps: ' + step + ' executed.');
}

program.command('migrate')
    .description('Migration runner')
    .argument('<string>', 'up down')
    .argument('[number]', 'Run Steps', 'all')
    .option('-r, --reset', 'Reset migration histories')
    .action(async (type, step, options) => {
        let logfile = folder.base('storage/stories/migrations.json');
        if (options.reset) {
            folder.fs.writeFileSync(logfile, '');
        }
        switch (type) {
            case 'up':
                await up(step, logfile);
                break;
            case 'down':
                await down(step, logfile);
                break;
            default:
                program.error('invalid type');
        }
        process.exit(1);
    });