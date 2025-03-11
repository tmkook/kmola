const folder = require('../folder');
const program = require('../program');

program.command('make:controller')
    .description('Create a Controller')
    .argument('<string>', 'Controller Name')
    .argument('[string]', 'Bind Model Name')
    .action((name, model) => {
        if (name.indexOf('_controller') < 0) {
            name += '_controller';
        }
        let require_model = '';
        let model_query = '//...';
        if (model) {
            require_model = 'const ' + model + ' = require("../models/' + model + '");' + "\r\n";
            model_query = 'model = ' + model + '.query()';
        }
        let target = folder.base('app/controllers/' + name + '.js');
        let stubfc = folder.root('commands/make-stubs/controller.js');
        folder.stub(target, stubfc, { controller: name, require_model: require_model, model_query: model_query });
    });