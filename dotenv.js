module.exports = new class dotenv {
    /**
     * 解析kv字符串
     * example: key=value to {key:value}
     * @param {string} content
     * @returns {map}
     */
    toJson(content) {
        let result = {};
        if (content && content.length > 3) {
            let lines = content.indexOf("\n") > -1 ? content.split("\n") : content.split("\r");
            for (let i = 0; i < lines.length; i++) {
                let item = lines[i].trim();
                if (item == '' || item.substring(0, 2) == '//') {
                    continue;
                }
                if (item.indexOf('=') > 1) {
                    let kv = item.split('=');
                    result[kv[0].trim()] = kv[1].trim();
                } else {
                    result[item] = '';
                }
            }
        }
        return result;
    }

    /**
     * 解析kv字符串
     * example:{key:value} to key=value
     * @param {string} content
     * @returns {map}
     */
    toEnv(map) {
        let lines = [];
        for (let i in map) {
            lines.push(i + '=' + map[i]);
        }
        return lines.join("\r\n");
    }

    /**
     * 解析env
     */
    parse(content) {
        let data = this.toJson(content);
        for (let i in data) {
            process.env[i] = data[i];
        }
    }

    /**
     * 获取ENV
     * @param {string} key 
     * @param {*} defaults 
     * @returns 
     */
    get(key, defaults) {
        let val = process.env[key] ?? defaults;
        if (val == 'true') {
            val = true;
        } else if (val == 'false') {
            val = false;
        } else if (val.indexOf('.') > -1 && parseFloat(val) > 0) {
            val = parseFloat(val);
        } else if (parseInt(val) > 0) {
            val = parseInt(val);
        } else {
            return val;
        }
    }
}