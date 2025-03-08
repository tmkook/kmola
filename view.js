const ejs = require('ejs');
const folder = require('./folder');

module.exports = new class view {
    ejs = ejs;

    async json(data) {
        return Promise.resolve({ type: "application/json", body: data });
    }

    async jsonp() {
        let data = Object.values(arguments);
        let key = data.shift();
        for (let i in data) {
            data[i] = JSON.stringify(data[i]);
        }
        let body = key + '(' + data.join(',') + ')';
        return Promise.resolve({ type: "text/javascript", body: body });
    }

    async error(message, code = 500) {
        return this.json({ status: code, msg: message });
    }

    async success(data, code = 0) {
        return this.json({ status: code, data: data });
    }

    async render(file, data, options) {
        let config = {
            cache: process.env.APP_ENV == 'development',
            async: true,
            filename: file
        };
        if (options) {
            config = Object.assign(config, options);
        }
        let path = folder.base('app/views/' + file + '.html');
        let html = await ejs.renderFile(path, data, config);
        return Promise.resolve({ type: "text/html", body: html });
    }

    renderSync(file, data, options) {
        let config = {
            cache: process.env.APP_ENV == 'development',
            filename: file
        };
        if (options) {
            config = Object.assign(config, options);
        }
        let content = folder.content(folder.base('app/views/' + file + '.html'));
        let html = ejs.render(content, data, config);
        return { type: "text/html", body: html };
    }

    jsonSync() {
        return { type: "application/json", body: data };
    }

    jsonpSync() {
        let data = Object.values(arguments);
        let key = data.shift();
        for (let i in data) {
            data[i] = JSON.stringify(data[i]);
        }
        let body = key + '(' + data.join(',') + ')';
        return { type: "text/javascript", body: body };
    }

    errorSync(message, code = 500) {
        return this.jsonSync({ status: code, msg: message });
    }

    successSync(data, code = 0) {
        return this.jsonSync({ status: code, data: data });
    }

    fileSync(file, data, options) {
        let config = {
            cache: true,
            async: true,
            filename: file
        };
        if (options) {
            config = Object.assign(config, options);
        }
        let path = folder.base('app/views/' + file + '.html');
        let html = ejs.render(folder.content(path), data, config);
        return { type: "text/html", body: html };
    }
}