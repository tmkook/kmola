const folder = require('../folder');
const program = require('../program');

program.command('public')
    .description('public symlink')
    .action(() => {
        if (!folder.fs.existsSync(folder.base('public/assets'))) {
            folder.fs.symlinkSync(folder.base('resource/assets'), folder.base('public/assets'), 'dir');
        }
        if (!folder.fs.existsSync(folder.base('public/uploads'))) {
            folder.fs.symlinkSync(folder.base('storage/uploads'), folder.base('public/uploads'), 'dir');
        }
        console.log('public successfull');
    });