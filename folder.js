const fs = require('fs');
const dir = require('path');

module.exports = new class folder {

    fs = fs;

    dir = dir;

    /**
     * 框架路径
     * @param {string} file 
     * @returns {string}
     */
    root(file) {
        return dir.resolve(__dirname, './' + (file ?? ''));
    }

    /**
    * 项目路径
    * @param {string} file 
    * @returns {string}
    */
    base(file) {
        return dir.resolve(process.cwd(), './' + (file ?? ''));
    }

    /**
     * 获取文件夹内所有文件
     * @param {string} path 
     * @param {string} extention 
     * @param {bool} absolute 
     * @returns {array}
     */
    files(path, extention = '.js', absolute = false) {
        let files = [];
        if (fs.existsSync(path)) {
            let dirs = fs.readdirSync(path);
            for (let i in dirs) {
                if (dirs[i] && dirs[i].substring(dirs[i].length - extention.length) == extention) {
                    if (absolute) {
                        files.push(dir.resolve(path, './' + dirs[i]));
                    } else {
                        files.push(dirs[i].replace(extention, ''));
                    }
                }
            }
        }
        return files;
    }

    /**
     * 读取文件夹
     * @param {string} path 
     * @param {bool} absolute 
     * @returns {array}
     */
    dirs(path, absolute = false) {
        let files = [];
        if (fs.existsSync(path)) {
            let dirs = fs.readdirSync(path);
            for (let i in dirs) {
                let name = dirs[i];
                let file = dir.resolve(path, './' + name);
                let stat = fs.lstatSync(file);
                if (stat.isDirectory()) {
                    files.push(absolute ? file : name);
                }
            }
        }
        return files;
    }

    /**
     * 读取文件内容
     * @param {string} path 
     * @param {string} charset 
     * @returns {string}
     */
    content(path, defaultValue = '', charset = 'utf-8') {
        let content = defaultValue;
        if (fs.existsSync(path)) {
            let read = fs.readFileSync(path, charset);
            content = read.length > 0 ? read : defaultValue;
        }
        return content;
    }

    /**
     * 加载目录下全部模块
     * @param {string} path 
     * @param {string} extention 
     * @returns {json}
     */
    imports(path, extention = '.js') {
        let conf = {};
        let files = this.files(path, extention, true);
        for (let i in files) {
            let file = files[i];
            let key = dir.parse(file).name;
            conf[key] = require(file);
        }
        return conf;
    }

    /**
     * 生成 stub
     * @param {string} file 
     * @param {string} stub 
     * @param {json} data 
     */
    stub(file, stub, data) {
        let content = this.content(stub);
        if (data) {
            for (let i in data) {
                content = content.replaceAll('____' + i + '____', data[i]);
            }
        }
        fs.writeFileSync(file, content);
        console.log(file + ' has been created');
    }

    /**
     * 检查文件夹，不存在就创建
     * @param {string} file 
     * @param {string} stub 
     * @param {json} data 
     */
    chkdir(dir) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    }

    subtree(path, dirs = []) {
        let subdir = this.dirs(path, true);
        if (subdir.length > 0) {
            for (let i in subdir) {
                dirs.push(subdir[i]);
                this.subtree(subdir[i], dirs);
            }
        }
        return dirs;
    }

    watchdirs(path, callback) {
        let dirs = this.subtree(path);
        for (let i in dirs) {
            fs.watch(dirs[i], (event, file) => {
                callback && callback(event, file, dirs[i]);
            });
        }
    }
}