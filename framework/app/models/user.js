/**
|--------------------------------------------------------------------------
| Sutando Model
| Document https://sutando.org/zh_CN/guide/models.html
|--------------------------------------------------------------------------
|
*/
const { Model, SoftDeletes, compose } = require('sutando');
const { auth } = require('kmola');
const Authenticate = auth('auth');

module.exports = class admin extends compose(Model, SoftDeletes, Authenticate) {
    hidden = ['password', 'deleted_at'];
}