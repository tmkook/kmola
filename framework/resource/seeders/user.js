/**
|--------------------------------------------------------------------------
| Model Seeder
|--------------------------------------------------------------------------
|
*/
const { secret } = require('kmola');
const user = require('../../app/models/user');

module.exports = class seeder {
    factor() {
        return {
            roles: 'user',
            username: 'test',
            nickname: 'test',
            avatar: '/assets/img/logo.png',
            password: secret.password('123456'),
        };
    }

    async seeder() {
        return user.query().create(this.factor());
    }
}