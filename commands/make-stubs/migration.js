/**
|--------------------------------------------------------------------------
| Sutando Migration
| Document https://sutando.org/zh_CN/guide/migrations.html
|--------------------------------------------------------------------------
|
*/
const { sutando } = require('sutando');
const schema = sutando.schema('default');

module.exports = class ____table____ {
    async up() {
        await schema.createTable('____table____', (table) => {
            table.increments('id');
            // ...
            table.timestamps();
            table.timestamp('deleted_at').nullable();
        });
    }
    async down() {
        await schema.dropTableIfExists('____table____');
    }
}