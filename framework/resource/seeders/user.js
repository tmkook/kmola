/**
|--------------------------------------------------------------------------
| Model Seeder
| Document https://fakerjs.dev/api/
|--------------------------------------------------------------------------
|
*/
const { secret } = require('kmola');
const user = require('../../app/models/user');

module.exports = class seeder {
    factor() {
        return {
            roles: 'user',
            username: 'jack',
            nickname: 'jack',
            avatar: '/assets/img/logo.png',
            password: secret.password('123456'),
        };
    }

    async seeder() {
        return user.query().create(this.factor());
    }
}