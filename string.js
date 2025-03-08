module.exports = new class string {
    /**
     * 生成雪花字符串
     * example: password(6) print aSdEsK
     * @param {integer} length 
     * @param {bool} isStrong 
     * @returns {string}
     */
    snow(length, isStrong) {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        if (isStrong) {
            characters += './_-&$@%:#';
        }
        for (let i = 0; i < length; i++) {
            let randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }
        return result;
    }

    /**
     * 生成 slug
     * example: slug(a a,-) print a-a
     * @param {string} str 
     * @param {string} gap 
     * @returns {string}
     */
    slug(str, gap = '-') {
        let news = [];
        let arr = str.split(' ');
        for (let i in arr) {
            if (arr[i]) {
                news.push(arr[i]);
            }
        }
        return news.join(gap);
    }

    /**
     * 生成 snack
     * example: snack(testSnack,-) print test-snack
     * @param {string} str 
     * @param {string} gap 
     * @returns {string}
     */
    snack(str, gap = '-') {
        let news = [];
        let arr = str.split('');
        for (let i in arr) {
            if (i > 0 && arr[i] === arr[i].toUpperCase()) {
                news.push(gap + arr[i])
            } else {
                news.push(arr[i]);
            }
        }
        return (news.join('').toLowerCase());
    }

    /**
     * 生成 camel
     * example: camel(test camel) print testCamel
     * @param {string} str 
     * @param {string} gap 
     * @returns {string}
     */
    camel(str, gap = ' ') {
        let arr = str.split('');
        for (let i in arr) {
            if (arr[i - 1] == gap) {
                arr[i] = arr[i].toUpperCase();
            } else {
                arr[i] = arr[i].toLowerCase();
            }
        }
        return (arr.join('').replaceAll(' ', ''));
    }

    /**
     * 省略字符串
     * example: limit(abcd,2) print ab...
     * @param {string} str 
     * @param {number} len 
     * @param {string} gap 
     * @returns {string}
     */
    limit(str, len = 6, gap = '...') {
        return str.substring(0, len) + gap;
    }

    /**
     * 字符串脱敏
     * example: mask(123456,2,2) print 12**56
     * @param {string} str 
     * @param {number} start 
     * @param {number} len 
     * @returns {string}
     */
    mask(str, start = 2, len = 3) {
        let arr = str.split('');
        for (let i in arr) {
            if (i >= start && i < start + len) {
                arr[i] = '*';
            }
        }
        return arr.join('');
    }

    /**
     * 生成重复字符串
     * example pad(a,3,-) print a-a-a
     * @param {string} str 
     * @param {number} len 
     * @param {string} gap 
     * @returns {string}
     */
    pad(str, len = 3, gap = '-') {
        let arr = [];
        for (let i = 0; i < len; i++) {
            arr.push(str);
        }
        return arr.join(gap);
    }

    /**
     * 过滤左侧符号和不可见字符
     * @param {string} str 
     * @param {string} symbol 
     * @returns {string}
     */
    ltrim(str, symbol = '') {
        let gap = symbol.split('');
        let arr = str.split('');
        for (let i in arr) {
            if (gap.includes(arr[i]) || /\s/.test(arr[i])) {
                arr[i] = '';
            } else {
                break;
            }
        }
        return arr.join('');
    }

    /**
     * 过滤左侧符号和不可见字符
     * @param {string} str 
     * @param {string} symbol 
     * @returns {string}
     */
    rtrim(str, symbol = '') {
        let gap = symbol.split('');
        let arr = str.split('');
        for (let i = arr.length - 1; i >= 0; i--) {
            if (gap.includes(arr[i]) || /\s/.test(arr[i])) {
                arr[i] = '';
            } else {
                break;
            }
        }
        return arr.join('');
    }

    /**
     * 过滤不可见字符
     * @param {string} str 
     * @param {string} symbol 
     * @returns {string}
     */
    trim(str, symbol = '') {
        str = this.ltrim(str, symbol);
        str = this.rtrim(str, symbol);
        return str;
    }

    /**
     * 获取最后一段
     * example:a/b/c
     * @param {string} content
     * @param {string} sysbol
     * @returns {string}
     */
    last(str, sysbol = '/') {
        if (str) {
            let arr = str.split(sysbol);
            return arr[arr.length - 1] ?? '';
        }
    }

    /**
     * 格式化时间戳秒 yyyy-mm-dd hh:ii:ss
     * @param {*} patter 
     * @param {*} time 
     * @returns 
     */
    datetime(patter, time) {
        if (!time) {
            time = this.timestamp();
        }
        patter = patter.toLowerCase();
        let date = new Date(time * 1000);
        let year = date.getFullYear();
        patter = patter.replace('y', year);

        let month = date.getMonth() + 1;
        month = month < 10 ? '0' + month : month;
        patter = patter.replace('m', month);

        let day = date.getDate();
        day = day < 10 ? '0' + day : day;
        patter = patter.replace('d', day);

        let hours = date.getHours();
        hours = hours < 10 ? '0' + hours : hours;
        patter = patter.replace('h', hours);

        let minute = date.getMinutes();
        minute = minute < 10 ? '0' + minute : minute;
        patter = patter.replace('i', minute);

        let second = date.getSeconds();
        second = second < 10 ? '0' + second : second;
        patter = patter.replace('s', second);
        return patter;
    }

    /**
     * 获取时间戳秒
     * @returns 
     */
    timestamp(str) {
        let ts = Date.now();
        if (str) {
            let date = new Date(str);
            ts = date.getTime();
        }
        return parseInt(ts / 1000);
    }
}