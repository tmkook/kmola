const config = require('./config');
const folder = require('./folder');
module.exports = class locale {
    context = null;
    supports = [];
    lang = '';
    constructor(context) {
        this.context = context
    }

    init() {
        if (this.supports.length > 0 && this.lang != '') return;
        let locale = config.get('app.locale', { default: "en", key: "lang" });
        this.supports = folder.dirs(folder.base('resource/locales'));
        this.lang = this.context.cookies.get(locale.key) ?? locale.default;
        for (let i in this.supports) {
            let langs = this.lang.split('-');
            let first = langs[0] ?? 'not.found.first';
            let second = langs[1] ?? 'not.found.second';
            if (this.supports[i] == this.lang || this.supports[i].indexOf(first) > -1 || this.supports[i].indexOf(second) > -1) {
                this.lang = this.supports[i];
                break;
            }
        }
    }

    /**
     * 设置语言
     * @param {string} lang 
     */
    set(lang) {
        if (folder.fs.existsSync(folder.base('resource/locales/' + lang))) {
            let locale = config.get('app.locale', { default: "en", key: "lang" });
            this.context.cookies.set(locale.key, lang);
        }
    }

    /**
     * 翻译
     * @param {string} trans 
     * @param {json} params 
     * @returns {string}
     */
    tr(trans, params) {
        this.init();
        let keys = trans.split('.');
        let name = keys.shift();
        let last = keys.pop();
        let file = folder.base('resource/locales/' + this.lang + '/' + name);
        let data = folder.fs.existsSync(file + '.js') ? require(file) : {};
        for (let i in keys) {
            data = data[keys[i]] ?? {};
        }
        if (data[last]) {
            if (typeof (params) == 'object') {
                for (let k in params) {
                    data[last] = data[last].replaceAll(':' + k, params[k]);
                }
            }
            return data[last];
        } else {
            console.log('locales: ' + trans + ' undefined');
            return last;
        }
    }
}