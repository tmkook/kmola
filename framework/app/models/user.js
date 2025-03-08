/**
|--------------------------------------------------------------------------
| Sutando Model
| Document https://sutando.org/zh_CN/guide/models.html
|--------------------------------------------------------------------------
|
*/
const { Model, SoftDeletes, compose } = require('sutando');

module.exports = class user extends compose(Model, SoftDeletes) {
    hidden = ['password', 'deleted_at'];
}