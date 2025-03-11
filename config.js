/**
 * 全部配置
 */
let configuration = {};

/**
 * 配置管理
 */
module.exports = new class config {

    /**
    * 添加配置
    * @param {json} data
    */
    add(data) {
        configuration = Object.assign(configuration, data);
    }

    /**
     * 获取配置
     * @param {string} key 
     * @param {*} def 
     * @returns {*}
     */
    get(key, def) {
        let data = Object.assign(configuration, {});
        let keys = key.split('.');
        for (let i in keys) {
            data = data[keys[i]] ?? def;
        }
        return data;
    }

    /**
    * 设置配置
    * @param {string} key 
    * @param {*} value 
    * @returns {*}
    */
    set(key, value) {
        let data = configuration;
        let keys = key.split('.');
        let last = keys.pop();
        for (let i in keys) {
            if (data[keys[i]] === undefined) {
                data[keys[i]] = {};
            }
            data = data[keys[i]];
        }
        data[last] = value;
        return configuration;
    }
}