const folder = require('../folder');
const program = require('../program');

program.command('public')
    .description('public symlink')
    .argument('<string>', 'Dir name', 'all')
    .action((dir) => {
        if (dir == 'assets' || dir == 'all') {
            if (!folder.fs.existsSync(folder.base('public/assets'))) {
                folder.fs.symlinkSync(folder.base('resource/assets'), folder.base('public/assets'), 'dir');
            }
        }
        if (dir == 'uploads' || dir == 'all') {
            if (!folder.fs.existsSync(folder.base('public/uploads'))) {
                folder.fs.symlinkSync(folder.base('storage/uploads'), folder.base('public/uploads'), 'dir');
            }
        }
        console.log('public successfull');
    });