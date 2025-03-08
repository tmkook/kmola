const { controller } = require("kmola");

module.exports = class welcome_controller extends controller {
    //...
    async index(context) {
        return this.view.render('welcome', null, { context: context });
    }
}