const cryptojs = require('crypto-js');

/**
 * 安全加密
 */
module.exports = new class secret {

    crypto = cryptojs;

    /**
     * 默认密钥
     */
    key = process.env.APP_KEY ?? '';

    /**
     * 设置密钥
     * @param {string} key 
     */
    constructor(key) {
        if (key) {
            this.key = key;
        }
    }

    instance(key) {
        return new secret(key);
    }

    /**
     * JWT 加密 exp=n(second)
     * @param {string} data 
     * @param {integer} exp 
     * @returns {string}
     */
    encode(data, exp) {
        let sign = parseInt(Date.now() / 1000) + '.' + parseInt(exp ?? 0) + '.' + data;
        return this.crypto.enc.Base64url.stringify(this.crypto.enc.Utf8.parse(this.crypto.AES.encrypt(sign, this.key).toString()));
    }

    /**
     * JWT 解密
     * @param {string} sign 
     * @returns {json|bool}
     */
    decode(sign) {
        try {
            if (!sign || sign.length < 32) {
                return false;
            } else {
                sign = this.crypto.enc.Base64url.parse(sign).toString(this.crypto.enc.Utf8);
                let dec = this.crypto.AES.decrypt(sign, this.key).toString(this.crypto.enc.Utf8);
                if (!dec) return false;
                let payload = dec.split('.');
                let ret = { est: parseInt(payload[0]), exp: parseInt(payload[1]), data: payload[2] };
                if (ret.exp < 1) return ret;
                let now = parseInt(Date.now() / 1000);
                return now - ret.est > ret.exp ? false : ret;
            }
        } catch (e) {
            return false;
        }
    }

    /**
     * MD5 签名
     * @param {json} data 
     * @returns {string}
     */
    sign(data) {
        let list = [];
        let keys = Object.keys(data).sort();
        for (let i in keys) {
            list.push(keys[i] + '=' + decodeURIComponent(data[keys[i]]));
        }
        let str = list.join('&');
        return this.crypto.MD5(str + '&key=' + this.key).toString();
    }

    /**
     * 验证签名
     * @param {json} query 
     * @param {string} sign 
     * @param {integer} exp 
     * @returns {bool}
     */
    verify(query, sign, exp) {
        let verify = this.sign(query, this.key);
        if (sign == verify) {
            if (exp > 0) {
                let now = parseInt(Date.now() / 1000);
                return now - query.ts < exp;
            } else {
                return true;
            }
        } else {
            return false;
        }
    }

    password(str) {
        let md5 = this.crypto.MD5(str).toString();
        let key = md5.substring(0, 3) + md5.substring(11, 14) + md5.substring(22, 25) + md5.substring(29);
        return this.crypto.HmacSHA256(md5, key).toString(this.crypto.enc.Base64);
    }
}