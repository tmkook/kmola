/**
|--------------------------------------------------------------------------
| Command Register
| Document https://github.com/tj/commander.js
|--------------------------------------------------------------------------
|
*/
const { program } = require('kola');

program.command('____name____')
    .description('____name____ Command Description')
    .action(function (port) {
        // ...
    });