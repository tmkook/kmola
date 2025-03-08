const koa = require('koa');
const folder = require('./folder');
const config = require('./config');
const dotenv = require('./dotenv');

//init
dotenv.parse(folder.content(folder.base('.env')));
config.add(folder.imports(folder.base('config')));
const app = new koa(config.get('app.koa'));

//session
const session = require('koa-session');
app.use(session(config.get('app.session'), app));

//public
const serve = require('koa-static');
app.use(serve(folder.base('public')));

//bodyparser
const bodyparser = require('koa-bodyparser');
app.use(bodyparser());

app.reload = function (path) {
    console.log('hotreload:', path);
    for (let file in require.cache) {
        if (file.indexOf(path) > -1) {
            delete require.cache[file];
        }
    }
}

module.exports = app;