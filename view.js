const ejs = require('ejs');
const folder = require('./folder');

module.exports = new class view {
    ejs = ejs;
    ext = '.html';
    path = folder.base('app/views/');

    /**
     * 初始化
     * @param {string} path 
     * @param {string} ext 
     */
    constructor(path, ext) {
        if (path) {
            this.path = path;
        }
        if (ext) {
            this.ext = ext;
        }
    }

    /**
     * 生成新的实例
     * @param {string} path 
     * @param {string} ext 
     * @returns {object}
     */
    instance(path, ext) {
        return new view(path, ext);
    }

    /**
     * 返回 JSON
     * @param {json} data 
     * @returns {Promise}
     */
    async json(data) {
        return Promise.resolve({ type: "application/json", data });
    }

    /**
     * @param {string} callback
     * @param {json} data1...
     * @returns {Promise}
     */
    async jsonp() {
        let data = Object.values(arguments);
        let key = data.shift();
        for (let i in data) {
            data[i] = JSON.stringify(data[i]);
        }
        let body = key + '(' + data.join(',') + ')';
        return Promise.resolve({ type: "text/javascript", body: body });
    }

    /**
     * 返回错误状态的 API JSON
     * @param {string} message 
     * @param {int} code 
     * @returns {Promise}
     */
    async error(message, code = 500) {
        return this.json({ status: code, msg: message });
    }

    /**
     * 返回成功状态的 API JSON
     * @param {string} message 
     * @param {int} code 
     * @returns {Promise}
     */
    async success(data, code = 0) {
        return this.json({ status: code, data: data });
    }

    /**
     * EJS 渲染一个 HTML 文件
     * @param {string} file 
     * @param {json} data
     * @param {json} options 
     * @returns {Promise}
     */
    async render(file, data, options) {
        let config = {
            cache: process.env.APP_ENV == 'development',
            async: true,
            filename: file
        };
        if (options) {
            config = Object.assign(config, options);
        }
        let path = this.path + '/' + file + this.ext;
        let html = await ejs.renderFile(path, data, config);
        return Promise.resolve({ type: "text/html", body: html });
    }

    /**
     * EJS 渲染一个 HTML 文件
     * @param {string} file 
     * @param {json} data
     * @param {json} options 
     * @returns {json}
     */
    renderSync(file, data, options) {
        let config = {
            cache: process.env.APP_ENV == 'development',
            filename: file
        };
        if (options) {
            config = Object.assign(config, options);
        }
        let path = this.path + '/' + file + this.ext;
        let content = folder.content(path);
        let html = ejs.render(content, data, config);
        return { type: "text/html", body: html };
    }

    /**
     * 返回 JSON
     * @param {json} data 
     * @returns {json}
     */
    jsonSync() {
        return { type: "application/json", body: data };
    }

    /**
     * @param {string} callback
     * @param {json} data1...
     * @returns {json}
     */
    jsonpSync() {
        let data = Object.values(arguments);
        let key = data.shift();
        for (let i in data) {
            data[i] = JSON.stringify(data[i]);
        }
        let body = key + '(' + data.join(',') + ')';
        return { type: "text/javascript", body: body };
    }

    /**
    * 返回错误状态的 API JSON
    * @param {string} message 
    * @param {int} code 
    * @returns {json}
    */
    errorSync(message, code = 500) {
        return this.jsonSync({ status: code, msg: message });
    }

    /**
    * 返回成功状态的 API JSON
    * @param {string} message 
    * @param {int} code 
    * @returns {json}
    */
    successSync(data, code = 0) {
        return this.jsonSync({ status: code, data: data });
    }
}