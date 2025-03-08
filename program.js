const { program } = require('commander');
const folder = require('./folder');

program.loader = function () {
    folder.imports(folder.base('provider/bootstraps'))
    folder.imports(folder.base('routes'));
    folder.imports(folder.root('commands'));
    folder.imports(folder.base('provider/commands'));
    return program;
}

module.exports = program;