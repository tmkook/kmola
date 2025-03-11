/**
|--------------------------------------------------------------------------
| Sutando Migration
| Document https://sutando.org/zh_CN/guide/migrations.html
|--------------------------------------------------------------------------
|
*/
const { sutando } = require('sutando');
const schema = sutando.schema('default');

module.exports = class admin_users {
    async up() {
        await schema.createTable('users', (table) => {
            table.increments('id');
            table.string('username', 32);
            table.string('nickname', 32);
            table.string('password', 120);
            table.string('roles').nullable();
            table.string('avatar').nullable();
            table.string('remark').nullable();
            table.timestamps();
            table.timestamp('deleted_at').nullable();
        });
    }
    async down() {
        await schema.dropTableIfExists('users');
    }
}