const folder = require('../folder');
const string = require('../string');
const program = require('../program');

async function up(step, logfile) {
    let executed = JSON.parse(folder.content(logfile, '{}'));
    let files = folder.imports(folder.base('resource/migrations'));
    let keys = Object.keys(files);
    let vals = Object.values(files);
    step = step == 'all' ? keys.length : parseInt(step);
    for (let i = 0; i < step; i++) {
        if (!executed[keys[i]]) {
            executed[keys[i]] = string.timestamp();
            let migrate = new vals[i];
            await migrate.up();
            console.log(keys[i] + ' done');
        }
    }
    folder.fs.writeFileSync(logfile, JSON.stringify(executed));
    console.log('migration up steps: ' + step + ' all executed.');
}

async function down(step, logfile) {
    let executed = JSON.parse(folder.content(logfile, '{}'));
    let files = folder.imports(folder.base('resource/migrations'));
    let keys = Object.keys(files);
    let vals = Object.values(files).reverse();
    step = step == 'all' ? keys.length : parseInt(step);
    for (let i = 0; i < step; i++) {
        if (executed[keys[i]]) {
            delete executed[keys[i]];
            let migrate = new vals[i];
            await migrate.down();
            console.log(keys[i] + ' done');
        }
    }
    folder.fs.writeFileSync(logfile, JSON.stringify(executed));
    console.log('migration up steps: ' + step + ' all executed.');
}

program.command('migrate')
    .description('Migration runner')
    .argument('<string>', 'up down')
    .argument('[number]', 'Run Steps', 1)
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