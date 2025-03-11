module.exports = class controller {
    context = null;
    constructor(context) {
        this.context = context;
        this.view = require('./view');
    }
}