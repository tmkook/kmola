const { controller } = require("kmola");

module.exports = class welcome_controller extends controller {
    //...
    async index(context) {
        let data = {
            title: context.locale.tr('welcome.title'),
            subtitle: context.locale.tr('welcome.subtitle')
        };
        return this.view.render('welcome', data);
    }
}