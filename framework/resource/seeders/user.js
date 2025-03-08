/**
|--------------------------------------------------------------------------
| Model Seeder
| Document https://fakerjs.dev/api/
|--------------------------------------------------------------------------
|
*/
const { secret } = require('kmola');
const { faker } = require('@faker-js/faker');
const user = require('../../app/models/user');

module.exports = class seeder {
    factor() {
        return {
            roles: 'user',
            avatar: faker.image.avatar(),
            username: faker.person.firstName(),
            nickname: faker.person.fullName(),
            password: secret.password('123456'),
        };
    }

    async seeder() {
        return user.query().create(this.factor());
    }
}